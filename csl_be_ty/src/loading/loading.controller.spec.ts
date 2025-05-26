import { Test, TestingModule } from '@nestjs/testing';
import { LoadingController } from './loading.controller';
import { LoadingService } from './loading.service';

describe('LoadingController', () => {
  let controller: LoadingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoadingController],
      providers: [LoadingService],
    }).compile();

    controller = module.get<LoadingController>(LoadingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
