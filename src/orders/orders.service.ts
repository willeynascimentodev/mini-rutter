import { Injectable } from '@nestjs/common';
import { HttpService }  from '@nestjs/axios'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { OrderInterface } from './order.interface';
import { Order } from './order.entity';
import { LineItem } from './line-item.entity';
import { ProductsService } from 'src/products/products.service';
@Injectable()
export class OrdersService {
    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(LineItem)
        private readonly lineItemRepository: Repository<LineItem>,
        private productService: ProductsService
    ) {}

    async fetchData(url: string) {

        const headers = {
            'X-Shopify-Access-Token': 'shpua_b1c9a97a8a3a33ee4a1aa0600b160cab',
          };
        return await this.httpService.get(url, {headers}).toPromise();
    }

    async createOrder(order: OrderInterface): Promise<Order> {
        
        const orderSaved = this.orderRepository.create({ plataform_id: order.plataform_id });
        
        order.lineItems.map(lineItemData =>
            this.lineItemRepository.create({ product_id: lineItemData.product_id, order: order })
        );

        return this.orderRepository.save(order);
    }

    async paginateOrders(offset: number, perPage: number): Promise<Order[]> {
        let products = await this.productService.findArrayProducts();
        
        let productsIds = [];
        for(let i=0; i<products.length; i++) {
            productsIds.push(products[i].products_plataform_id);
        }

        const orders = await this.orderRepository
        .createQueryBuilder('order')
        .innerJoinAndSelect('order.line_items', 'line_item') 
        .where('line_item.product_id IN (:...productIds)', { productIds: productsIds })
        .offset(offset)
        .limit(perPage)
        .getMany();
        return orders;
    }

    async findAllOrders(): Promise<Order[]> {
        return this.orderRepository.createQueryBuilder('order').getMany();
    }
}
