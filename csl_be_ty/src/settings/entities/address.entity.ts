import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class InvoiceAddress {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true})
    addressLine: string;

    @Column({nullable: true})
    streetAddress: string;

    @Column({nullable: true})
    box: string;

    @Column({nullable: true})
    city: string;

    @Column({nullable: true})
    state: string;
}
