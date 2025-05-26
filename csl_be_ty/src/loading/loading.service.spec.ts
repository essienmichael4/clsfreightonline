import { Test, TestingModule } from '@nestjs/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoadingService],
    }).compile();

    service = module.get<LoadingService>(LoadingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
