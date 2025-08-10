import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Client } from "./client.entity";
import { User } from "./user.entity";

@Entity({name: "payment"})
export class Payment {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    paidShippingRate: number;

    @Column({ nullable: true })
    paymentMethod: string; // e.g., "Cash", "Momo", "Card"

    @Column({ nullable: true })
    reference: string; // External transaction ID or invoice reference

    @ManyToOne(() => Client, (client) => client.payments)
    @JoinColumn({ name: 'paidBy' })
    client: Client;

    @ManyToOne(() => User, (User) => User.payments)
    @JoinColumn({ name: 'paidTo' })
    user: User;
}
