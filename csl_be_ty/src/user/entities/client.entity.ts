import { Package } from "src/package/entities/package.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Details } from "./details.entity";
import { Attachment } from "./attachment.entity";
import { MembershipTier } from "./membership.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

@Entity({name: "client"})
export class Client {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    name:string

    @Column({unique: true})
    shippingMark:string

    @Column({
        unique: true
    })
    email:string

    @Column()
    password:string

    @Column({nullable: true})
    phone:string

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalShippingRate: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ default: Deleted.FALSE })
    isDeleted: Deleted;

    @OneToMany(() => Package, (packageEntity) => packageEntity.user)
    packages: Package[];

    @OneToOne(()=> Details, (details)=> details.client , { cascade: true })
    @JoinColumn({ name: 'clientAddress' })
    clientDetails: Details

    @OneToMany(() => Attachment, (attachmentEntity) => attachmentEntity.client)
    attachments: Attachment[];

    @Column({ nullable: true })
    membershipTierId: number;

    @ManyToOne(() => MembershipTier, (tier) => tier.clients, { eager: true, nullable: true })
    @JoinColumn({ name: 'membershipTierId' })
    membershipTier: MembershipTier;
}
