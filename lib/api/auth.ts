import { fetchApi } from "./client";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

export function login(data: LoginRequest): Promise<LoginResponse> {
  return fetchApi<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
