import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Client } from "./client.entity";

@Entity({name: "attachment"})
export class Attachment {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    name:string

    @ManyToOne(() => Client, (client) => client.attachments)
    @JoinColumn({ name: 'owner' })
    client: Client;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}