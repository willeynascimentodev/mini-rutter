import { Controller, Get } from '@nestjs/common';
import { find } from 'rxjs';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly shopifyService: ProductsService) {}

    private limit: number = 50; 
    private totalProduct: number = 500; 
    private apiUrl: string = "https://rutterinterview.myshopify.com/admin/api/2023-10/products.json";

    @Get('')
    async fetchProductsData() {
        try {
            let loops = (this.totalProduct)/this.limit;
            let nextUrl = `${this.apiUrl}?limit=${this.limit}`;
            
            for(let i=0; i<loops; i++) {
                
                const response = await this.shopifyService.fetchData(nextUrl);
                nextUrl = response.headers.link != undefined ? response.headers.link : null
                nextUrl = this.extractUrl(nextUrl);

                if(nextUrl == null) {
                    break;
                }
            }
            
        } catch (error) {
            return error
        }
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
