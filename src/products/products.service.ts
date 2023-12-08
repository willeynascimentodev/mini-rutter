import { Injectable } from '@nestjs/common';
import { HttpService }  from '@nestjs/axios'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { ProductInterface } from './product.interface';
import { LineItem } from 'src/orders/line-item.entity';
import * as dotenv from 'dotenv';
@Injectable()
export class ProductsService {
    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(LineItem)
        private readonly lineItemRepository: Repository<LineItem>,
    ) {}

    async fetchData(url: string) {
        dotenv.config();
        const headers = {
            'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY,
          };
        return await this.httpService.get(url, {headers}).toPromise();
    }

    async createProduct(product: ProductInterface): Promise<Product> {
        return this.productRepository.save(product);
    }

    async findAllProducts(): Promise<Product[]> {
        return this.productRepository.createQueryBuilder('products').getMany();
    }

    async findArrayProducts(): Promise<{products_plataform_id: string}[]> {
        return this.productRepository.createQueryBuilder('products')
        .select('products.plataform_id')
        .getRawMany();
    }

    async findByOrderId(id:string) {
        const orders = await this.lineItemRepository.query(
            `SELECT li.product_id FROM line_item as li
            INNER JOIN product as p ON p.plataform_id = li.product_id
            WHERE li.orderId = ?`, [id]
          );

        return orders;
    }

    async paginateProducts(offset: number, perPage: number): Promise<Product[]> {
        return this.productRepository.createQueryBuilder('products').offset(offset).limit(perPage).getMany();
    }
}
