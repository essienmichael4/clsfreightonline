import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Package } from "./package.entity";

@Entity()
export class PackageType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    rate: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    cedisRate: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Package, (packageEntity) => packageEntity.packageType)
    packages: Package[];
}
