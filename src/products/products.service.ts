import { Injectable } from '@nestjs/common';
import { HttpService }  from '@nestjs/axios'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { ProductInterface } from './product.interface';

@Injectable()
export class ProductsService {
    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async fetchData(url: string) {

        const headers = {
            'X-Shopify-Access-Token': 'shpua_b1c9a97a8a3a33ee4a1aa0600b160cab',
          };
        return await this.httpService.get(url, {headers}).toPromise();
    }

    async createProduct(product: ProductInterface): Promise<Product> {
        return this.productRepository.save(product);
    }

    async findAllProducts(offset: number, perPage: number): Promise<Product[]> {
        return this.productRepository.createQueryBuilder('url').offset(offset).limit(perPage).getMany();
    }
}
