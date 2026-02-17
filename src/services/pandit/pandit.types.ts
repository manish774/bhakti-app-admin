export interface IPandit {
  id?: string;
  name: string;
  about: string;
  address: string;
  email?: string;
  phone: string;
  extraInfo?: string;
  specialization: string[];
  templeAssociatedId: string[];
}
