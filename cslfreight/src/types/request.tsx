export type RequestType = 'pickup' | 'delivery';
export type PartyType = 'self' | 'third-party';

export interface RequestFormData {
  shippingMark: string;
  requestType: RequestType;
  partyType: PartyType;
  thirdPartyName?: string;
  thirdPartyPhone?: string;
  loadingDate: string;
  location: string;
  callNumber: string;
}

export interface RequestStatus {
  current: 'submitted' | 'confirmed' | 'ready' | 'delivered';
  timestamp: string;
}
