export interface EventProps {
  _id?: string;
  id?: string;
  coreEventId: string;
  eventName: string;
  templeId: string[];
  packageId: string[];
  pricePackageId: {
    packageId: string;
    price: number;
    discount: number;
  }[];
  isPopular?: boolean;
  eventStartTime: string;
  eventExpirationTime: string;
}

export type UpdateEventPayload = Pick<EventProps, "id"> &
  Partial<Omit<EventProps, "id">>;
