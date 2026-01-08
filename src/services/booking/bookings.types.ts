export interface BookingDevotee {
  name: string;
  gotra?: string;
  phoneNumber?: string;
  email?: string;
}

export interface BookingProps {
  id?: string;
  _id: string;
  coreType: string;
  eventId: string;
  userId: string;
  pujaId: string;
  templeId: string;
  packageId: string;
  devotees: BookingDevotee[];
  totalAmount: number;
  prasadIncluded: boolean;
  prasadCharge: number;
  bookingDate: Date;
  pujaDate: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentId?: string;
  videoUrl?: string;
  videoUploadedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UpdateBookingPayload = Pick<BookingProps, "id"> &
  Partial<Omit<BookingProps, "id">>;
