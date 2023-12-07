import { Test, TestingModule } from '@nestjs/testing';
import { ShopifyControllerController } from './shopify-controller.controller';

describe('ShopifyControllerController', () => {
  let controller: ShopifyControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopifyControllerController],
    }).compile();

    controller = module.get<ShopifyControllerController>(ShopifyControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
