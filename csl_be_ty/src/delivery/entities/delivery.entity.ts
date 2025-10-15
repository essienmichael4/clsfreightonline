import { Client } from "src/user/entities/client.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum PickupBy {
    SELF = 'Self',
    THIRD_PARTY = 'Third Party',
}

export enum Status {
    COMPLETED = 'Completed',
    PENDING = 'Pending',
}

export enum Confirmation {
    PENDING = 'Pending',
    CONFIRMED = "Confirmed",
    DECLINED = "Declined"
}

export enum PickupReady {
    TRUE = 'True',
    FALSE = "False",
}

export enum DeliveryType {
    DELIVERY = 'Delivery',
    PICKUP = 'Pickup',
}

@Entity()
export class Delivery {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    phone:string
    
    @Column({ nullable:true })
    loaded: Date;

    @Column({ nullable:true })
    location: string;

    @Column({ default: PickupBy.SELF })
    pickupBy: PickupBy;

    @Column({ default: DeliveryType.PICKUP })
    deliveryType: DeliveryType;

    @Column({nullable: true})
    thirdPartyName:string

    @Column({nullable: true})
    thirdPartyPhone:string
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'enum', enum: Status, default: Status.PENDING })
    status: Status;

    @Column({ type: 'enum', enum: Confirmation, default: Confirmation.PENDING })
    isConfirmed: Confirmation;

    @Column({ type: 'enum', enum: PickupReady, default: PickupReady.FALSE })
    isPickupReady: PickupReady;

    @ManyToOne(() => Client, (client) => client.deliveries, { onDelete: "CASCADE" })
    client: Client; 
}
