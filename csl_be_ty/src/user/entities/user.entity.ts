import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
export type Deleted = "TRUE" | "FALSE"

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

    @Column({
        type: "enum",
        enum: ["TRUE", "FALSE"],
        default: "FALSE"
    })
    isDeleted:Deleted
}
