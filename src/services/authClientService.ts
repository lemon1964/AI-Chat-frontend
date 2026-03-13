// src/services/authClientService.ts
import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import store from "@/store/store";
import { showNotification } from "@/reducers/notificationReducer";
import { localizationService } from "@/services/localizationService";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Проверка истечения токена
const isTokenExpired = (token: string) => {
  if (!token) return true;

  const parts = token.split(".");
  if (parts.length !== 3) {
    console.log("Invalid token format");
    return true;
  }

  try {
    const payload = JSON.parse(atob(parts[1]));
    return !payload.exp || payload.exp * 1000 < Date.now();
  } catch (error) {
    console.log("Error decoding token payload", error);
    return true;
  }
};

let isSigningOut = false;

// Обработчик выхода из сессии
const handleSignOut = () => {
  if (!isSigningOut) {
    isSigningOut = true;
    // уведомление об истечении сессии
    store.dispatch(showNotification(localizationService.get("SessionExpired"), "info", 3));
    localStorage.removeItem("auto-guest-login");
    signOut();
    isSigningOut = false;
  }
};

// Создание экземпляра axios
const apiClient = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

// Перехватчик запросов
apiClient.interceptors.request.use(async config => {
  const session = await getSession();

  if (session?.accessToken && isTokenExpired(session.accessToken)) {
    try {
      const { data } = await axios.post(
        `${baseURL}/api/auth/refresh/`,
        { refresh: session.refreshToken },
        { headers: { "Content-Type": "application/json" } }
      );
      session.accessToken = data.accessToken;
      session.refreshToken = data.refreshToken;
    } catch {
      handleSignOut();
      throw new axios.Cancel(localizationService.get("RequestBlocked"));
    }
  }

  if (session?.accessToken) {
    config.headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  return config;
});

// Перехватчик ответов
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // если ошибка сети (сервер не отвечает)
    if (error.code === "ERR_NETWORK") {
      store.dispatch(showNotification(localizationService.get("ServerOfflineBanner"), "error", 6));
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const session = await getSession();

      if (session?.refreshToken) {
        try {
          const { data } = await axios.post(
            `${baseURL}/api/auth/refresh/`,
            { refresh: session.refreshToken },
            { headers: { "Content-Type": "application/json" } }
          );

          session.accessToken = data.accessToken;
          session.refreshToken = data.refreshToken;

          originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
          return apiClient(originalRequest);
        } catch {
          handleSignOut();
          return Promise.reject(error);
        }
      } else {
        handleSignOut();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;