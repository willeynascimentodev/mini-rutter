import { Injectable } from '@nestjs/common';
import { HttpService }  from '@nestjs/axios'

@Injectable()
export class ProductsService {
    constructor(private readonly httpService: HttpService) {}

    async fetchData(url: string) {

        const headers = {
            'X-Shopify-Access-Token': 'shpua_b1c9a97a8a3a33ee4a1aa0600b160cab',
            // Adicione outros cabeçalhos conforme necessário
          };
        return await this.httpService.get(url, {headers}).toPromise();
    }
}
