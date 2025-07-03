import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./client.entity";

@Entity({name: "details"})
export class Details {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'date', nullable: true })
    dob?: Date;

    @Column({nullable:true})
    location:string

    @Column({nullable:true})
    nextOfKin:string

    @Column({ nullable: true })
    nextOfKinPhone:string

    @OneToOne(()=> Client, (client)=> client.clientDetails, { onDelete: "CASCADE" })
    client: Client
}
