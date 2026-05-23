/**
 * Comprehensive API Types for Bhakti App
 * This file contains all TypeScript types for models, requests, and responses
 * Can be shared with frontend applications
 */

/* ==================== Common Types ==================== */

export type IStatus = "ENABLE" | "DISABLE";
export type IActivness = "ACTIVE" | "INACTIVE";
export type GroupTypes = "PUBLIC" | "PRIVATE";

/* ==================== User & Auth Types ==================== */

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  role?: "user" | "admin";
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserAuth {
  emailOrPhone: string;
  password: string;
  id: string;
  isVerified?: boolean;
  verificationCode?: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userdetail: IUser;
  token: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

/* ==================== Core Event Types ==================== */

export enum CoreEventIds {
  ONLINE_PUJA = "coreevent_online_puja",
  OFFLINE_PUJA = "coreevent_offline_puja",
}

export interface CoreEvent {
  _id?: string;
  type: CoreEventIds;
  title: string;
  description?: string;
  icon: string;
  color?: string;
  shadowColor?: string;
  visible?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCoreEventRequest {
  type: CoreEventIds;
  title: string;
  description?: string;
  icon: string;
  color?: string;
  shadowColor?: string;
  visible?: boolean;
}

export interface UpdateCoreEventRequest {
  type: CoreEventIds;
  title?: string;
  description?: string;
  icon?: string;
  color?: string;
  shadowColor?: string;
  visible?: boolean;
}

export interface GetCoreEventsByTypesRequest {
  types: CoreEventIds[];
}

export interface GetCoreEventsResponse {
  data: CoreEvent[];
  pagination: Pagination;
}

/* ==================== Package Types ==================== */

export interface IPackageDescription {
  id: number;
  detail: string;
}

export interface IPackage {
  _id?: string;
  name: string;
  numberOfPerson: number;
  title: string;
  price: number;
  description: IPackageDescription[];
  isPopular: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePackageRequest {
  name: string;
  numberOfPerson: number;
  title?: string;
  price: number;
  description?: IPackageDescription[];
  isPopular?: boolean;
}

export interface UpdatePackageRequest {
  id: string;
  name?: string;
  numberOfPerson?: number;
  title?: string;
  price?: number;
  description?: IPackageDescription[];
  isPopular?: boolean;
}

export interface DeletePackageRequest {
  id: string;
}

export interface GetPackagesByIdsRequest {
  ids: string[];
}

export interface GetPackagesResponse {
  data: IPackage[];
  pagination: Pagination;
}

/* ==================== Event Types ==================== */

export interface PackageIddec {
  packageId: string;
  price: number;
  discount: number;
}

export interface Ievent {
  _id?: string;
  coreEventId?: string;
  eventName: string;
  templeId: string[];
  packageId: string[];
  pricePackageId: PackageIddec[];
  eventExpirationTime: string;
  eventStartTime: string;
  isPopular: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateEventRequest {
  coreEventId: string;
  eventName: string;
  templeId: string[];
  packageId: string[];
  pricePackageId: PackageIddec[];
  eventStartTime: string;
  eventExpirationTime: string;
  isPopular?: boolean;
}

export interface UpdateEventRequest {
  id: string;
  coreEventId?: string;
  eventName?: string;
  templeId?: string[];
  packageId?: string[];
  pricePackageId?: PackageIddec[];
  eventStartTime?: string;
  eventExpirationTime?: string;
  isPopular?: boolean;
}

export interface DeleteEventRequest {
  id: string;
}

export interface GetEventsResponse {
  data: Ievent[];
  pagination: Pagination;
}

/* ==================== Temple Types ==================== */

export interface ILocation {
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

export interface IPrasadDelivery {
  included: boolean;
  deliveryTime: string;
  prasadCharge: number;
}

export interface ITemple {
  _id?: string;
  name: string;
  location: ILocation;
  image?: string;
  extraInfo?: any;
  description: string[];
  images?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTempleRequest {
  name: string;
  location: ILocation;
  image?: string;
  extraInfo?: any;
  description: string[];
  images?: string[];
}

export interface UpdateTempleRequest {
  id: string;
  name?: string;
  location?: ILocation;
  image?: string;
  extraInfo?: any;
  description?: string[];
  images?: string[];
}

/* ==================== Pandit Types ==================== */

export interface IPandit {
  _id?: string;
  name: string;
  about: string;
  address: string;
  email?: string;
  phone: string;
  extraInfo?: string;
  specialization: string[];
  templeAssociatedId: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePanditRequest {
  name: string;
  about: string;
  address: string;
  email?: string;
  phone: string;
  extraInfo?: string;
  specialization: string[];
  templeAssociatedId: string[];
}

export interface UpdatePanditRequest {
  id: string;
  name?: string;
  about?: string;
  address?: string;
  email?: string;
  phone?: string;
  extraInfo?: string;
  specialization?: string[];
  templeAssociatedId?: string[];
}

export interface DeletePanditRequest {
  id: string;
}

/* ==================== Booking Types ==================== */

export interface IBookingDevotee {
  name: string;
  gotra?: string;
  phoneNumber?: string;
  email?: string;
}

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface IBooking {
  _id?: string;
  coreType: string;
  eventId: string;
  userId: string;
  templeId: string;
  packageId: string;
  devotees: IBookingDevotee[];
  totalAmount: number;
  prasadIncluded: boolean;
  prasadCharge: number;
  bookingDate: Date;
  pujaDate: Date;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  videoUrl?: string;
  videoUploadedAt?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateBookingRequest {
  coreType: string;
  eventId: string;
  userId: string;
  templeId: string;
  packageId: string;
  devotees: IBookingDevotee[];
  totalAmount: number;
  prasadIncluded: boolean;
  prasadCharge: number;
  pujaDate: Date;
  notes?: string;
}

export interface UpdateBookingRequest {
  id: string;
  coreType?: string;
  eventId?: string;
  userId?: string;
  templeId?: string;
  packageId?: string;
  devotees?: IBookingDevotee[];
  totalAmount?: number;
  prasadIncluded?: boolean;
  prasadCharge?: number;
  pujaDate?: Date;
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  paymentId?: string;
  videoUrl?: string;
  notes?: string;
}

/* ==================== Question & Answer Types ==================== */

export interface IQuestions {
  _id?: string;
  askedBy: string;
  groupId: string;
  question: string;
  dateTime: string;
  status: IStatus;
  isActive: IActivness;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAnswers {
  _id?: string;
  answeredBy: string;
  groupId: string;
  answer: string;
  dateTime: string;
  status: IStatus;
  isActive: IActivness;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateQuestionRequest {
  question: string;
  groupId: string;
  dateTime: string;
  status?: IStatus;
  isActive?: IActivness;
}

export interface CreateAnswerRequest {
  answer: string;
  groupId: string;
  dateTime: string;
  status?: IStatus;
  isActive?: IActivness;
}

/* ==================== Game Types ==================== */

export interface IGame {
  _id?: string;
  questionId: string;
  answerId: string;
  groupId: string;
  answer: string;
  question: string;
  askedBy: string;
  answeredBy: string;
  dateTime: string;
  status: IStatus;
  isActive: IActivness;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StartGameRequest {
  groupId: string;
  dateTime: string;
}

export interface GameStartResponse {
  answers: IAnswers[];
  questions: IQuestions[];
}

/* ==================== Group Types ==================== */

export interface IGroups {
  _id?: string;
  name: string;
  description?: string;
  type: GroupTypes;
  adminIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  type?: GroupTypes;
  adminIds?: string[];
}

export interface UpdateGroupRequest {
  id: string;
  name?: string;
  description?: string;
  type?: GroupTypes;
  adminIds?: string[];
}

/* ==================== Puja Types ==================== */

export interface IPujaDescription {
  description: string;
}

export interface IBenefit {
  name: string;
  benifit: string;
}

export interface IPujaMetadata {
  lastDate: string;
  description: string;
  pujaName: string;
  metadata: string;
}

export interface IPuja {
  _id?: string;
  coreId: string;
  className: string;
  name: string;
  startPrice: number;
  description: IPujaDescription[];
  pujaDescription: IPujaMetadata;
  benefits: IBenefit[];
  templeId: string;
  metaData?: any;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePujaRequest {
  coreId: string;
  className: string;
  name: string;
  startPrice: number;
  description: IPujaDescription[];
  pujaDescription: IPujaMetadata;
  benefits: IBenefit[];
  templeId: string;
  metaData?: any;
  isActive?: boolean;
}

export interface UpdatePujaRequest {
  id: string;
  coreId?: string;
  className?: string;
  name?: string;
  startPrice?: number;
  description?: IPujaDescription[];
  pujaDescription?: IPujaMetadata;
  benefits?: IBenefit[];
  templeId?: string;
  metaData?: any;
  isActive?: boolean;
}

/* ==================== Upload Types ==================== */

export interface UploadedFile {
  filename: string;
  url: string;
}

export interface UploadSingleResponse {
  message: string;
  file: UploadedFile;
}

export interface UploadMultipleResponse {
  message: string;
  files: UploadedFile[];
}

/* ==================== Error & Pagination Types ==================== */

export interface ApiError {
  message?: string;
  field?: string;
  code?: string;
}

export interface Pagination {
  page?: number;
  limit?: number;
  total?: number;
  pages?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

/* ==================== Generic Response Types ==================== */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ListResponse<T> {
  data: T[];
  pagination: Pagination;
}

/* ==================== Admin Response Types ==================== */

export interface AdminPagination {
  current: number;
  total: number;
  count: number;
  totalRecords: number;
}

export interface AdminApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
  pagination?: AdminPagination;
}

export interface AdminBookingsListResponse {
  success: boolean;
  data: IBooking[];
  pagination: AdminPagination;
}

export interface AdminBookingResponse {
  success: boolean;
  data: IBooking;
  message?: string;
}

export interface AdminBookingCreateResponse {
  success: boolean;
  message: string;
  data: IBooking;
}

export interface AdminBookingStatsResponse {
  success: boolean;
  data: {
    bookings: {
      total: number;
      today: number;
      monthly: number;
      pending: number;
      confirmed: number;
      completed: number;
    };
    revenue: {
      total: number;
      monthly: number;
    };
  };
}

export interface AdminStatusUpdateResponse {
  success: boolean;
  message: string;
  data: IBooking;
}

export interface AdminVideoUploadResponse {
  success: boolean;
  message: string;
  data: IBooking;
}

/* ==================== Compatibility/Alias Types ==================== */

export type User = IUser;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PujaType {
  id?: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TempleResponse extends AdminApiResponse<ITemple[]> {
  data: ITemple[];
}
