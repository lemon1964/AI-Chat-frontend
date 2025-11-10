// src/hooks/useModels.ts
import { useGetModelsQuery } from "@/services/chatApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setAvailableModels } from "@/reducers/availableModelsReducer";
import { modelActions } from "@/reducers/modelReducer";
import { flagsActions } from "@/reducers/flagsReducer";

export const useModels = () => {
  const { data, isLoading, refetch } = useGetModelsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 3600000, // обновление раз в час
  });

  const dispatch = useDispatch<AppDispatch>();

  // Установка доступных моделей
  useEffect(() => {
    if (data && !isLoading) {
      // 1. Сохраняем доступные модели в store
      dispatch(setAvailableModels(data));

      // 2. Устанавливаем первую текстовую модель по умолчанию
      if (data.text_models?.length > 0) {
        dispatch(modelActions.setModel(data.text_models[0].model_id));
      }
    }
  }, [data, isLoading, dispatch]);

  // Установка флагов авторизации
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { default: apiClient } = await import("@/services/authClientService");
        const { data } = await apiClient({ url: "/api/auth/me/flags/", method: "GET" });
        if (isMounted) {
          dispatch(
            flagsActions.setFlags({
              isAuthenticated: !!data.is_authenticated,
              isPremium: !!data.is_premium,
              limits: data.limits,
            })
          );
          // if (process.env.NODE_ENV !== "production") {
          //   console.log("[flags] fetched:", {
          //     isAuthenticated: !!data.is_authenticated,
          //     isPremium: !!data.is_premium,
          //     limits: data.limits,
          //   });
          // }
        }
      } catch {
        /* no-op */
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return {
    isLoadingModels: isLoading,
    refetchModels: refetch,
  };
};
