import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Client } from './client.entity';

@Entity()
export class MembershipTier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // e.g., Bronze, Silver, Gold

  @Column('text', { nullable: true })
  description?: string;

  @Column('int')
  priority: number; // e.g., 1 = Bronze, 4 = Platinum

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  minShipping: number; // threshold in USD

  @OneToMany(() => Client, (client) => client.membershipTier)
  clients: Client[];
}
