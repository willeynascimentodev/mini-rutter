import { Controller, Get, Query  } from '@nestjs/common';
import { ProductsService } from './products.service';
import { off } from 'process';
import { UtilsService } from 'src/utils/utils.service';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly utilsService: UtilsService
    ) {}

    private limit: number = 50; 
    private totalProduct: number = 1000000; 
    private apiUrl: string = "https://rutterinterview.myshopify.com/admin/api/2023-10/products.json";
    private perPage: number = 10;

    @Get('fetch')
    async fetchProductsData() {
        try {
            let loops = (this.totalProduct)/this.limit;
            let nextUrl = `${this.apiUrl}?limit=${this.limit}`;

            let productsStored = await this.productsService.findAllProducts();

            
            if(productsStored.length == this.totalProduct) {
                loops = 0;
            }
            
            for(let i=0; i<loops; i++) {
                
                const response = await this.productsService.fetchData(nextUrl);
                nextUrl = response.headers.link != undefined ? response.headers.link : null
                nextUrl = this.utilsService.extractUrl(nextUrl);
                
                for(let j=0; j<response.data.products.length; j++) {
                    let product = response.data.products[j];
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
        let offset = currentPage == 1 ? 0 : (page * this.perPage) - this.perPage
        return await this.productsService.paginateProducts(offset, this.perPage);
    }
}
