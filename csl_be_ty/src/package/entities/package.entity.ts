import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PackageEdit } from "./packageEdits.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
  }
  
  export enum Status {
    ON_HOLD = 'ON_HOLD',
    EN_ROUTE = 'EN_ROUTE',
    ARRIVED = 'ARRIVED',
    DELIVERED = 'DELIVERED',
  }

@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  trackingNumber: string;

  @Column()
  customer: string;

  @Column('float')
  cbm: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  package: string;

  @Column()
  quantity: number;

  @Column()
  vessel: string;

  @Column()
  loaded: Date;

  @Column()
  eta: Date;

  @Column()
  received: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: Deleted.FALSE })
  isDeleted: Deleted;

  @Column({ type: 'enum', enum: Status })
  status: Status;

  @Column()
  addedBy: number;

  @ManyToOne(() => User, (user) => user.packages)
  @JoinColumn({ name: 'addedBy' })
  user: User;

  @OneToMany(() => PackageEdit, (packageEdit) => packageEdit.package)
  edits: PackageEdit[];
}
