import { Package } from "src/package/entities/package.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Details } from "./details.entity";
import { Attachment } from "./attachment.entity";
import { MembershipTier } from "./membership.entity";
import { Payment } from "./payment.entity";
import { Invoice } from "src/invoice/entities/invoice.entity";
import { VideoLike } from "src/video/entities/video-like.entity";
import { VideoComment } from "src/video/entities/video-comment.entity";
import { Delivery } from "src/delivery/entities/delivery.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

export enum ApprovalStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
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

    @Column({ default: ApprovalStatus.PENDING })
    approvalStatus: ApprovalStatus;

    @Column({ nullable: true, default: "regular"})
    accountStage: string;

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

    @OneToMany(() => VideoLike, (like) => like.video)
    likes: VideoLike[];

    @OneToMany(() => VideoComment, (comment) => comment.client)
    comments: VideoComment[];

    @OneToMany(() => Delivery, (delivery) => delivery.client)
    deliveries: Delivery[];

    @Column({ nullable: true })
    membershipTierId: number;

    @ManyToOne(() => MembershipTier, (tier) => tier.clients, { eager: true, nullable: true })
    @JoinColumn({ name: 'membershipTierId' })
    membershipTier: MembershipTier;
}
