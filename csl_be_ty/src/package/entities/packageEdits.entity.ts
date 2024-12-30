import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Package } from "./package.entity";

@Entity()
export class PackageEdit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  editedBy: number;

  @ManyToOne(() => User, (user) => user.packageEdits)
  @JoinColumn({ name: 'editedBy' })
  user: User;

  @Column()
  editedPackage: number;

  @ManyToOne(() => Package, (packageEntity) => packageEntity.edits)
  @JoinColumn({ name: 'editedPackage' })
  package: Package;
}
