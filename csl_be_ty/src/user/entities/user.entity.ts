import { Address } from "src/address/entities/address.entity";
import { Announcement } from "src/announcement/entities/announcement.entity";
import { ClientAnnouncement } from "src/announcement/entities/clientAnnouncement.entity";
import { Deleted, Package } from "src/package/entities/package.entity";
import { PackageEdit } from "src/package/entities/packageEdits.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

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

    @Column({ default: Role.USER })
    role: Role;

    @OneToMany(() => Package, (packageEntity) => packageEntity.user)
    packages: Package[];

    @OneToMany(() => PackageEdit, (packageEdit) => packageEdit.user)
    packageEdits: PackageEdit[];

    @OneToMany(()=> Announcement, (announcement) => announcement.updatedBy)
    announcements: Announcement[]

    @OneToMany(()=> ClientAnnouncement, (clientAnnouncement) => clientAnnouncement.updatedBy)
    clientAnnouncements: ClientAnnouncement[]

    @OneToMany(()=> Address, (address) => address.updatedBy)
    address: Address[]
}
