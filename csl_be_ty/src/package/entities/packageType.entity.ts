import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Package } from "./package.entity";

@Entity()
export class PackageType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
    }})
    rate: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
    }})
    cedisRate: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Package, (packageEntity) => packageEntity.packageType)
    packages: Package[];
}
