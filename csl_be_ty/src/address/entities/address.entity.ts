import { User } from "src/user/entities/user.entity"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
export enum Show {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    contact: string

    @Column()
    mobile: string

    @Column()
    address: string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(()=> User, (user)=> user.announcements, {cascade: true})
    updatedBy: User
}
