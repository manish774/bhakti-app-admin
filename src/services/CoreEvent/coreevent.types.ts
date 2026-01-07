export type CoreEventProps = {
  _id?: string;
  type: string; // enum identifier from backend (e.g. coreevent_online_puja)
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  shadowColor?: string;
  visible?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateCoreEventPayload = Partial<CoreEventProps> & {
  type?: string;
};
