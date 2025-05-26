import { Address } from "src/address/entities/address.entity";
import { Announcement } from "src/announcement/entities/announcement.entity";
import { Deleted, Package } from "src/package/entities/package.entity";
import { PackageEdit } from "src/package/entities/packageEdits.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Status {
    IN_TRANSIT = 'IN_TRANSIT',
    ARRIVED = 'ARRIVED',
    DELIVERED = 'DELIVERED',
}

@Entity()
export class Loading {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    vessel:string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({
        nullable:true
    })
    loaded: Date;

    @Column({
        nullable:true
    })
    eta: Date;

    @Column({ nullable: true, type: "text" })
    description: string;

    @Column({ default: Status.IN_TRANSIT })
    status: Status;

    @ManyToOne(() => User, (user) => user.packages)
    @JoinColumn({ name: 'addedBy' })
    user: User;
}
