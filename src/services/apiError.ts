import type { AxiosError } from "axios";

export function parseApiError(error: unknown): string {
  // default fallback
  const fallback = "Something went wrong";

  if (!error || typeof error !== "object") return fallback;

  const err = error as AxiosError & { apiMessage?: string };

  // If we already attached a parsed message, return it
  if (typeof (err as any).apiMessage === "string")
    return (err as any).apiMessage;

  // Try common shapes: { response: { data: { message } } }
  const response: any = (err as any).response;
  if (response?.data) {
    const data = response.data;

    // Validation errors: { error: { errors: { field: [{ message }] } } }
    if (data?.error?.errors && typeof data.error.errors === "object") {
      try {
        const messages: string[] = [];
        Object.values(data.error.errors).forEach((val: any) => {
          if (Array.isArray(val)) {
            val.forEach((v) => {
              if (v?.message) messages.push(v.message);
              else if (typeof v === "string") messages.push(v);
            });
          } else if (typeof val === "string") {
            messages.push(val);
          } else if (val?.message) {
            messages.push(val.message);
          }
        });
        if (messages.length) return messages.join(". ");
      } catch {
        // fall through
      }
    }

    // Common message fields
    if (typeof data?.message === "string") return data.message;
    if (typeof data?.error === "string") return data.error;

    // If data itself is a string
    if (typeof data === "string") return data;
  }

  // Fallback to Axios / JS error message
  if (err.message) return err.message;

  return fallback;
}
