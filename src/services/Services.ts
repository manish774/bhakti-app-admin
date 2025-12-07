import apiClient from "./interceptor";
import DashboardEventEmitter from "./DashboardEvents";
import type {
  LoginCredentials,
  PujaType,
  Temple,
  ApiResponse,
  Package,
} from "../types/api";

class Services {
  private static instance: Services;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Services();
    }
    return this.instance;
  }

  public async getAllTemples(): Promise<Temple[]> {
    const response = await apiClient.get("/api/admin/temples");
    // Handle the nested response structure
    if (response.data && response.data.data && response.data.data.data) {
      return response.data.data.data;
    }
    return response.data?.data || response.data || [];
  }

  public async addTemple(
    templeData: Omit<Temple, "_id" | "createdAt" | "updatedAt" | "__v">
  ): Promise<Temple> {
    const response = await apiClient.post("/api/admin/temples", templeData);

    // Emit event to notify dashboard of data change
    DashboardEventEmitter.getInstance().emit("templesUpdated");

    return response.data;
  }

  public async updateTemple(
    templeId: string,
    templeData: Partial<Temple>
  ): Promise<Temple> {
    const response = await apiClient.put(
      `/api/admin/temples/${templeId}`,
      templeData
    );

    // Emit event to notify dashboard of data change
    DashboardEventEmitter.getInstance().emit("templesUpdated");

    return response.data;
  }

  public async deleteTemple(templeId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete(`/api/admin/temples/${templeId}`);

    // Emit event to notify dashboard of data change
    DashboardEventEmitter.getInstance().emit("templesUpdated");

    return response.data;
  }

  public async addPackage(
    templeId: string,
    packageData: Omit<Package, "id">
  ): Promise<Temple> {
    const response = await apiClient.post(
      `/api/admin/temples/${templeId}/packages`,
      packageData
    );

    // Emit event to notify dashboard of data change
    DashboardEventEmitter.getInstance().emit("templesUpdated");

    return response.data;
  }

  public async deletePackage(
    templeId: string,
    packageId: string
  ): Promise<{ success: boolean }> {
    const response = await apiClient.delete(
      `/api/admin/temples/${templeId}/packages/${packageId}`
    );

    // Emit event to notify dashboard of data change
    DashboardEventEmitter.getInstance().emit("templesUpdated");

    return response.data;
  }

  public async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ token: string; _doc: object }>> {
    const response = await apiClient.post("/api/auth/login", credentials);

    // Store the token in localStorage for future requests
    if (response.data.data.token) {
      localStorage.setItem("authToken", response.data.data.token);
      document.cookie = `token=${response.data.data.token}; path=/; secure; samesite=strict`;
    }

    return response.data;
  }

  // Additional methods for puja types
  public async getAllPujaTypes(): Promise<PujaType[]> {
    const response = await apiClient.get("/api/admin/puja-types");
    return response.data;
  }

  public async createPujaType(
    pujaTypeData: Omit<PujaType, "id" | "createdAt" | "updatedAt">
  ): Promise<PujaType> {
    const response = await apiClient.post(
      "/api/admin/puja-types",
      pujaTypeData
    );
    return response.data;
  }

  public async updatePujaType(
    id: string,
    pujaTypeData: Partial<PujaType>
  ): Promise<PujaType> {
    const response = await apiClient.put(
      `/api/admin/puja-types/${id}`,
      pujaTypeData
    );
    return response.data;
  }

  public async deletePujaType(id: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete(`/api/admin/puja-types/${id}`);
    return response.data;
  }

  public async getProfile(): Promise<
    ApiResponse<{ name: string; email: string }>
  > {
    const response = await apiClient.get("/api/profile/profile");
    return response.data;
  }

  public checkAuthToken(): string | null {
    // Check localStorage first
    const token = localStorage.getItem("authToken");
    if (token) {
      return token;
    }

    // Check cookies as backup
    const cookieMatch = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));

    if (cookieMatch) {
      return cookieMatch.split("=")[1];
    }

    return null;
  }

  public async restoreUserSession(): Promise<{
    name: string;
    email: string;
  } | null> {
    const token = this.checkAuthToken();

    if (!token) {
      return null;
    }

    try {
      const profileResponse = await this.getProfile();
      return profileResponse.data;
    } catch (error) {
      // If profile fetch fails, clear invalid token
      console.error("Failed to restore session:", error);
      localStorage.removeItem("authToken");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      return null;
    }
  }
}
export default Services;
