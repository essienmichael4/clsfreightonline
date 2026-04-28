import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadService } from 'src/upload/upload.service';
import { Repository } from 'typeorm';
import { uuid } from 'uuidv4';
import { Product, ProductStatus } from './entities/product.entity';

export interface ProductQuery {
  status?:     string;
  search?:     string;
  page?:       number;
  limit?:      number;
  featured?:   boolean;
}

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
    private readonly uploadService:UploadService
  ) {}

  createProduct(id: number, createProductDto: CreateProductDto) {
    return this.repo.save(this.repo.create({ ...createProductDto, productId: uuid() }));
  }

  findRaw(productId: string) {
    return this.repo.findOne({ 
      where: { productId },
    })
  }

  async findAll(query: ProductQuery = {}) {
    const qb = this.repo.createQueryBuilder('p')

    // Status — admin can pass any status, storefront defaults to active
    if (query.status) {
      qb.where('p.status = :status', { status: query.status });
    } else {
      qb.where('p.status = :status', { status: ProductStatus.ACTIVE });
    }

    if (query.search) {
      qb.andWhere(
        '(p.name LIKE :s OR p.description LIKE :s OR p.tags LIKE :s OR brand.name LIKE :s)',
        { s: `%${query.search}%` },
      );
    }

    const page  = Math.max(1, Number(query.page)  || 1);
    const limit = Math.min(100, Number(query.limit) || 20);
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    
    const dataWithUrls = await Promise.all(data.map(p => this.attachImageUrls(p)))
    return { data: dataWithUrls, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const p = await this.repo.findOne({ where: { productId: id } })
    if (!p) throw new NotFoundException('Product not found')

    const filenames = (p.images ?? []).filter(
      f => f && typeof f === 'string' && f.trim() !== '' && !f.startsWith('http')
    )

    const imageUrls = await Promise.all(
      filenames.map(f => this.uploadService.getProductSignedUrl(f))
    )

    return { ...p, imageUrls }
  }

  async update(id: string, dto: Partial<Product>) {
    Logger.log(`Updating product ${id} with data: ${JSON.stringify(dto)}`);

    const exists = await this.repo.findOne({ where: { productId: id } });
    if (!exists) throw new NotFoundException();

    const { images, ...rest } = dto;

    // Build the update payload explicitly
    const updatePayload: Partial<Product> = { ...rest };

    // Only include images in the update if explicitly provided
    if (images !== undefined && images !== null  && images.length > 0) {
      updatePayload.images = images;
    }

    // Use update() instead of save() — only touches columns in the payload
    await this.repo.update({ productId: id }, updatePayload);

    return this.repo.findOne({ where: { productId: id } });
  }

  softDelete(id: string) {
    return this.repo.update({productId: id}, { status: ProductStatus.ARCHIVED });
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }

  private async attachImageUrls(product: Product): Promise<Product & { imageUrls: string[] }> {
    const filenames = (product.images ?? []).filter(
      f => f && typeof f === 'string' && f.trim() !== '' && !f.startsWith('http')
    )

    const imageUrls = await Promise.all(
      filenames.map(f => this.uploadService.getProductSignedUrl(f))
    )

    return { ...product, imageUrls }
  }
}
