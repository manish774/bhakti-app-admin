/**
 * API Types - Re-exports from data.ts for backward compatibility
 * New code should import directly from types/data.ts
 */

// Re-export all types from data.ts
export {
  type IStatus,
  type IActivness,
  type GroupTypes,
  type IUser,
  type IUserAuth,
  type SignupRequest,
  type LoginRequest,
  type LoginResponse,
  type VerifyOtpRequest,
  type VerifyOtpResponse,
  type ResendOtpRequest,
  type ResendOtpResponse,
  type UpdateProfileRequest,
  type CoreEventIds,
  type CoreEvent,
  type CreateCoreEventRequest,
  type UpdateCoreEventRequest,
  type GetCoreEventsByTypesRequest,
  type GetCoreEventsResponse,
  type IPackageDescription,
  type IPackage,
  type CreatePackageRequest,
  type UpdatePackageRequest,
  type DeletePackageRequest,
  type GetPackagesByIdsRequest,
  type GetPackagesResponse,
  type PackageIddec,
  type Ievent,
  type CreateEventRequest,
  type UpdateEventRequest,
  type DeleteEventRequest,
  type GetEventsResponse,
  type ILocation,
  type IPrasadDelivery,
  type ITemple,
  type CreateTempleRequest,
  type UpdateTempleRequest,
  type IPandit,
  type CreatePanditRequest,
  type UpdatePanditRequest,
  type DeletePanditRequest,
  type IBookingDevotee,
  type BookingStatus,
  type PaymentStatus,
  type IBooking,
  type CreateBookingRequest,
  type UpdateBookingRequest,
  type IQuestions,
  type IAnswers,
  type CreateQuestionRequest,
  type CreateAnswerRequest,
  type IGame,
  type StartGameRequest,
  type GameStartResponse,
  type IGroups,
  type CreateGroupRequest,
  type UpdateGroupRequest,
  type IPujaDescription,
  type IBenefit,
  type IPujaMetadata,
  type IPuja,
  type CreatePujaRequest,
  type UpdatePujaRequest,
  type UploadedFile,
  type UploadSingleResponse,
  type UploadMultipleResponse,
  type ApiError,
  type Pagination,
  type PaginatedResponse,
  type ApiResponse,
  type ListResponse,
  type AdminPagination,
  type AdminApiResponse,
  type AdminBookingsListResponse,
  type AdminBookingResponse,
  type AdminBookingCreateResponse,
  type AdminBookingStatsResponse,
  type AdminStatusUpdateResponse,
  type AdminVideoUploadResponse,
  type LoginCredentials,
  type PujaType,
  type User,
  type TempleResponse,
} from "./data";

// Keep legacy API-specific types for backward compatibility
// These should be gradually migrated to use data.ts types

export interface PackageDescription {
  id: number;
  detail: string;
}

export interface Package {
  id: string;
  name: string;
  numberOfPerson: number;
  title: string;
  price: number;
  description: PackageDescription[];
  isPopular: boolean;
}

export interface PrasadDelivery {
  included: boolean;
  deliveryTime: string;
  prasadCharge: number;
}

export interface Pandit {
  name: string;
  about: string;
}

export interface Contact {
  phone: string;
  email: string;
}

export interface ExtraInfo {
  templeTiming: string;
  famousFor: string;
  contact: Contact;
  website: string;
}

export interface Temple {
  _id: string;
  name: string;
  location: string;
  image: string;
  description: string[];
  packages: Package[];
  extraInfo: ExtraInfo;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
