export interface UserProps {
  id?: string;
  _id: string;
  name: string;
  email: string;
  role?: "user" | "admin";
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UpdateUserPayload = Pick<UserProps, "id"> &
  Partial<Omit<UserProps, "id">>;
