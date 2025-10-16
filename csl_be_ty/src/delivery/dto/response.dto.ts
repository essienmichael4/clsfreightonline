import { ClientResponseDto, UserResponseDto } from "src/user/dto/user-response.dto";
import { Confirmation, Delivery, DeliveryType, PickupBy, Status } from "../entities/delivery.entity";
import { Client } from "src/user/entities/client.entity";

export class DeliveryResponseDto {
  id: number
  phone: string
  location: string
  loaded: string
  deliveryType: string
  pickupBy: string
  thirdPartyName?: string
  thirdPartyPhone?: string
  status: string
  isConfirmed: string
  isPickupReady: string
  createdAt: string
  updatedAt?: string
  client?: Partial<Pick<Client, 'id' | 'name' | 'email' | 'shippingMark'>>

  constructor(delivery: Delivery) {
    this.id = delivery.id
    this.phone = delivery.phone
    this.location = delivery.location
    this.loaded = delivery.loaded?.toISOString()
    this.deliveryType = delivery.deliveryType
    this.pickupBy = delivery.pickupBy
    this.thirdPartyName = delivery.thirdPartyName
    this.thirdPartyPhone = delivery.thirdPartyPhone
    this.status = delivery.status
    this.isConfirmed = delivery.isConfirmed
    this.isPickupReady = delivery.isPickupReady
    this.createdAt = delivery.createdAt?.toISOString()
    this.updatedAt = delivery.updatedAt?.toISOString()

    // only map client if present
    if (delivery.client) {
      const { id, name, email, shippingMark } = delivery.client
      this.client = { id, name, email, shippingMark }
    }
  }
}
