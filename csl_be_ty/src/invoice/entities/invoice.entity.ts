import { Package } from "src/package/entities/package.entity";
import { Client } from "src/user/entities/client.entity";
import {  Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, CreateDateColumn, UpdateDateColumn} from "typeorm";
import { User } from "src/user/entities/user.entity";

export enum Status {
    DRAFT= "DRAFT",
    OPEN= "OPEN",
    PAID= "PAID",
    PAST_DUE= "PAST_DUE",
}

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  invoiceId: string;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column({ type: "date" })
  issuedDate: Date;

  @Column({ type: "date", nullable: true })
  eta: Date;

  // ---- Company (your) details ----
  @Column()
  companyName: string;

  // ---- Client ----
  @ManyToOne(() => Client, (client) => client.invoices, { eager: true })
  client: Client;

  @Column()
  clientName: string;

  // ---- Packages ----
  @ManyToMany(() => Package, { eager: true })
  @JoinTable()
  packages: Package[];

  @Column({ type: "int", default: 0 })
  totalQty: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  totalCbm: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  total: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  rate: number;

  // ---- Meta ----
  @ManyToOne(() => User, { eager: true })
  createdBy: User;

  @Column({ default: Status.DRAFT })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
