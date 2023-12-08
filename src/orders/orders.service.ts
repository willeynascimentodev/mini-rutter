import { Injectable } from '@nestjs/common';
import { HttpService }  from '@nestjs/axios'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderInterface } from './order.interface';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    ) {}

    async fetchData(url: string) {

        const headers = {
            'X-Shopify-Access-Token': 'shpua_b1c9a97a8a3a33ee4a1aa0600b160cab',
          };
        return await this.httpService.get(url, {headers}).toPromise();
    }

    async createOrder(order: OrderInterface): Promise<Order> {
        return this.orderRepository.save(order);
    }

    async paginateOrders(offset: number, perPage: number): Promise<Order[]> {
        return this.orderRepository.createQueryBuilder('order').offset(offset).limit(perPage).getMany();
    }

    async findAllOrders(): Promise<Order[]> {
        return this.orderRepository.createQueryBuilder('order').getMany();
    }
}
