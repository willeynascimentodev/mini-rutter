import { Injectable } from '@nestjs/common';
import { HttpService }  from '@nestjs/axios'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { OrderInterface } from './order.interface';
import { Orders } from './order.entity';
import { LineItem } from './line-item.entity';
import { ProductsService } from 'src/products/products.service';
import * as dotenv from 'dotenv';

@Injectable()
export class OrdersService {
    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(Orders)
        private readonly orderRepository: Repository<Orders>,
        @InjectRepository(LineItem)
        private readonly lineItemRepository: Repository<LineItem>,
        private productService: ProductsService
    ) {}

    async fetchData(url: string) {
        dotenv.config();
        const headers = {
            'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY,
          };
        return await this.httpService.get(url, {headers}).toPromise();
    }

    async createOrder(order: OrderInterface): Promise<Orders> {
        const orderSaved = await this.orderRepository.save(order);
        for(let i=0; i<order.lineItems.length; i++) {
            let item = order.lineItems[i];
            
            if(item?.product_id) {
                this.lineItemRepository.save({
                    product_id: item.product_id,
                    orderId: orderSaved.id,
                    order: orderSaved
                });
            }
        }
        return orderSaved;
    }

    async paginateOrders(offset: number, perPage: number): Promise<Orders[]> {
        let products = await this.productService.findArrayProducts();
        
        let productsIds = [];
        for(let i=0; i<products.length; i++) {
            productsIds.push(products[i].products_plataform_id);
        }

        const orders = await this.orderRepository
        .createQueryBuilder('orders')
        .getMany();

        let ordersRelated = [];
        for(let i=0; i<orders.length; i++) {
            orders[i].line_items = await this.productService.findByOrderId(orders[i].id);
            if(orders[i].line_items.length > 0) {
                ordersRelated.push(orders[i]);
            }
        }

        return ordersRelated;
    }

    async findAllOrders(): Promise<Orders[]> {
        return this.orderRepository.createQueryBuilder('order').getMany();
    }
}
