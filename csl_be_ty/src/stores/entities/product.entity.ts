import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';

export enum ProductStatus {
  DRAFT    = 'draft',
  ACTIVE   = 'active',
  ARCHIVED = 'archived',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type:'uuid', unique:true})
  productId!: string;

//   @Index({ unique: true })
//   @Column({ type: 'varchar', length: 100 })
//   sku: string;

  @Column({ type: 'varchar', length: 500 })
  name: string;

//   @Index({ unique: true })
//   @Column({ type: 'varchar', length: 500 })
//   slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

//   @Column({ name: 'category_id', type: 'varchar', length: 36, nullable: true })
//   categoryId: string | null;

//   @Column({ name: 'brand_id', type: 'varchar', length: 36, nullable: true })
//   brandId: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

//   @Column({ name: 'discount_price', type: 'decimal', precision: 12, scale: 2, nullable: true })
//   discountPrice: number | null;

//   @Column({ name: 'stock_qty', type: 'int', default: 0 })
//   stockQty: number;

//   @Column({ name: 'youtube_url', type: 'varchar', length: 500, nullable: true })
//   youtubeUrl: string | null;

  @Column({ type: 'json', nullable: true })
  images: string[] | null;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.DRAFT })
  status: ProductStatus;

//   @Column({ type: 'varchar', length: 500, nullable: true })
//   tags: string | null;

//   @Column({ name: 'meta_title', type: 'varchar', length: 200, nullable: true })
//   metaTitle: string | null;

//   @Column({ name: 'meta_description', type: 'text', nullable: true })
//   metaDescription: string | null;

//   @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
//   weight: number;

//   @Column({ name: 'is_featured', type: 'boolean', default: false })
//   isFeatured: boolean;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
