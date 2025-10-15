export type DeliveryType = 'Pickup' | 'Delivery';
export type PickupBy = 'Self' | 'Third Party';

export interface RequestFormData {
  shippingMark: string;
  deliveryType: DeliveryType;
  pickupBy: PickupBy;
  thirdPartyName?: string;
  thirdPartyPhone?: string;
  loadedDate: string;
  location: string;
  phone: string;
}

export interface RequestStatus {
  current: 'submitted' | 'confirmed' | 'ready' | 'delivered';
  timestamp: string;
}
