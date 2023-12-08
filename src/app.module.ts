import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/products.entity';
const dbConfig = require("../ormconfig"); 
@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [
    AppController, 
    ProductsController],
  providers: [
    AppService,
    ProductsService
  ],
})
export class AppModule {}
