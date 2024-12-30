import { Deleted, Package } from "src/package/entities/package.entity";
import { PackageEdit } from "src/package/entities/packageEdits.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "user"})
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name:string

    @Column({
        unique: true
    })
    email:string

    @Column()
    password:string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ default: Deleted.FALSE })
    isDeleted: Deleted;

    @OneToMany(() => Package, (packageEntity) => packageEntity.user)
    packages: Package[];

    @OneToMany(() => PackageEdit, (packageEdit) => packageEdit.user)
    packageEdits: PackageEdit[];
}
