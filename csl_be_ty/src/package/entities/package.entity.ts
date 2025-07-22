import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PackageEdit } from "./packageEdits.entity";
import { Client } from "src/user/entities/client.entity";
import { PackageType } from "./packageType.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
  }
  
  export enum Status {
    ON_HOLD = 'ON_HOLD',
    YET_TO_LOAD = 'YET_TO_LOAD',
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

  @Column({ nullable: true, type: "text" })
  description: string;

  @Column({ nullable: true })
  package: string;

  @Column()
  quantity: number;

  @Column({
    nullable:true
  })
  vessel: string;

  @Column({
    nullable:true
  })
  departure: Date;

  @Column({
    nullable:true
  })
  loaded: Date;

  @Column({
    nullable:true
  })
  eta: Date;

  @Column({
    nullable:true
  })
  received: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: Deleted.FALSE })
  isDeleted: Deleted;

  @Column({ type: 'enum', enum: Status, default: "YET_TO_LOAD" })
  status: Status;

  @Column()
  addedBy: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingRate: number;

  @ManyToOne(() => User, (user) => user.packages)
  @JoinColumn({ name: 'addedBy' })
  user: User;

  @ManyToOne(() => Client, (client) => client.packages)
  @JoinColumn({ name: 'owner' })
  client: Client;

  @OneToMany(() => PackageEdit, (packageEdit) => packageEdit.package)
  edits: PackageEdit[];

  @ManyToOne(() => PackageType, (packageType) => packageType.packages)
  @JoinColumn({ name: 'packageTypes' })
  packageType: PackageType;
}
