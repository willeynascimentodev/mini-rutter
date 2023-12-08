import { Controller, Get, Query  } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UtilsService } from 'src/utils/utils.service';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly orderService: OrdersService,
        private readonly url: UtilsService,
    ) {}

    private limit: number = 50; 
    private totalOrder: number = 500; 
    private apiUrl: string = "https://rutterinterview.myshopify.com/admin/api/2023-10/orders.json";
    private perPage: number = 10;

    @Get('fetch')
    async fetchOrdersData() {
        try {
            let loops = (this.totalOrder)/this.limit;
            let nextUrl = `${this.apiUrl}?limit=${this.limit}`;

            let ordersStored = await this.orderService.findAllOrders();
            if(ordersStored.length == this.totalOrder) {
                loops = 0;
            }


            for(let i=0; i<loops; i++) {
                
                const response = await this.orderService.fetchData(nextUrl);
                
                nextUrl = response.headers?.link != undefined ? response.headers.link : null
                nextUrl = this.url.extractUrl(nextUrl);

                for(let j=0; j<response.data.orders.length; j++) {
                    let order = response.data.orders[j];

                    let lineItems = [];
                    for(let l=0; l<order.line_items.length; l++) {
                        lineItems.push({
                            product_id: order.line_items[l].product_id
                        });                        
                    }  

                    this.orderService.createOrder({
                        plataform_id: order.id,
                        lineItems: lineItems
                    });
                }

                if(nextUrl == null) {
                    break;
                }
            }
            return {
                message: 'Orders fetched'
            }
        } catch (error) {
            return error
        }
    }

    @Get('') 
    async getOrders(@Query('page') page: number) {
        let currentPage = page ? page : 1;
        let offset = currentPage == 1 ? 0 : (page * this.perPage) - this.perPage
        return await this.orderService.paginateOrders(offset, this.perPage);
    }

}
