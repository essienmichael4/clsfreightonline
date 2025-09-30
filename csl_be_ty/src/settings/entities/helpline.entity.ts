import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Helpline {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    phone: string;
}
