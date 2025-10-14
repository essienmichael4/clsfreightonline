import { IsEnum, IsOptional, IsString } from "class-validator";
import { DeliveryType, PickupBy, Status } from "../entities/delivery.entity";

export class CreateDeliveryDto {
    @IsString()
    phone: string

    @IsString()
    loadedDate: string

    @IsString()
    location: string

    @IsString()
    @IsOptional()
    thirdPartyName: string

    @IsString()
    @IsOptional()
    thirdPartyPhone: string

    @IsEnum(DeliveryType)
    deliveryType: DeliveryType

    @IsEnum(PickupBy)
    pickupBy: PickupBy
}
