import { Controller, Get, Query  } from '@nestjs/common';
import { ProductsService } from './products.service';
import { off } from 'process';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService
    ) {}

    private limit: number = 50; 
    private totalProduct: number = 64; 
    private apiUrl: string = "https://rutterinterview.myshopify.com/admin/api/2023-10/products.json";
    private perPage: number = 10;

    @Get('fetch')
    async fetchProductsData() {
        try {
            let loops = (this.totalProduct)/this.limit;
            let nextUrl = `${this.apiUrl}?limit=${this.limit}`;

            let productsStored = await this.productsService.findAllProducts(1, 10);

            
            if(productsStored.length == this.totalProduct) {
                loops = 0;
            }
            
            for(let i=0; i<loops; i++) {
                
                const response = await this.productsService.fetchData(nextUrl);
                nextUrl = response.headers.link != undefined ? response.headers.link : null
                nextUrl = this.extractUrl(nextUrl);
                
                for(let i=0; i<response.data.products.length; i++) {
                    let product = response.data.products[i];
                    this.productsService.createProduct({
                        plataform_id: product.id,
                        name: product.title
                    })
                }

                if(nextUrl == null) {
                    break;
                }
            }
            return {
                message: 'Products fetched'
            }
        } catch (error) {
            return error
        }
    }

    @Get('') 
    async getProducts(@Query('page') page: number) {
        let currentPage = page ? page : 1;
        let offset = page == 1 ? 0 : (page * this.perPage) - this.perPage
        return await this.productsService.findAllProducts(offset, this.perPage);
    }

    extractUrl(field: string) {
        const regex = /<([^>]*)>; rel="next"/;
        const match = regex.exec(field);

        // A URL estará no grupo de captura (índice 1)
        if (match && match[1]) {
            const nextUrl = match[1];
            return nextUrl;
        } else {
            return null;
        }
    }
}
