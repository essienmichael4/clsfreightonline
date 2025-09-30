import { Package } from "src/package/entities/package.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Details } from "./details.entity";
import { Attachment } from "./attachment.entity";
import { MembershipTier } from "./membership.entity";
import { Payment } from "./payment.entity";
import { Invoice } from "src/invoice/entities/invoice.entity";

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

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
    }})
    totalShippingRate: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ default: Deleted.FALSE })
    isDeleted: Deleted;

    @OneToMany(() => Package, (packageEntity) => packageEntity.user)
    packages: Package[];

    @OneToMany(() => Invoice, (invoice) => invoice.client)
    invoices: Invoice[];

    @OneToOne(()=> Details, (details)=> details.client , { cascade: true })
    @JoinColumn({ name: 'clientAddress' })
    clientDetails: Details

    @OneToMany(() => Attachment, (attachmentEntity) => attachmentEntity.client)
    attachments: Attachment[];

    @OneToMany(() => Payment, (paymentEntity) => paymentEntity.client)
    payments: Payment[];

    @Column({ nullable: true })
    membershipTierId: number;

    @ManyToOne(() => MembershipTier, (tier) => tier.clients, { eager: true, nullable: true })
    @JoinColumn({ name: 'membershipTierId' })
    membershipTier: MembershipTier;
}
