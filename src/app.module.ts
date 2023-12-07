import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShopifyControllerController } from './shopify-controller/shopify-controller.controller';

@Module({
  imports: [],
  controllers: [AppController, ShopifyControllerController],
  providers: [AppService],
})
export class AppModule {}
