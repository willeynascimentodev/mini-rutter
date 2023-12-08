import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/products.entity';
import { Order } from './orders/order.entity';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { UtilsService } from './utils/utils.service';
const dbConfig = require("../ormconfig"); 
@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forFeature([Product, Order]),
  ],
  controllers: [
    AppController, 
    ProductsController, 
    OrdersController
  ],
  providers: [
    AppService,
    ProductsService,
    OrdersService,
    UtilsService
  ],
})
export class AppModule {}
