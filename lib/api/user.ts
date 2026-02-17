import { fetchApi } from "./client";

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export function register(data: RegisterRequest): Promise<void> {
  return fetchApi<void>("/user", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getProfile(token: string): Promise<UserProfile> {
  return fetchApi<UserProfile>("/user/profile", { token });
}
