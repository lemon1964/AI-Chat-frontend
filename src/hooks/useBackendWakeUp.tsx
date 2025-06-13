// frontend/src/hooks/useBackendWakeUp.tsx
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import apiClient from "@/services/authClientService";
import { showNotification } from "@/reducers/notificationReducer";

export default function useBackendWakeUp() {
  const dispatch = useDispatch<AppDispatch>();
  const [isWakingUp, setIsWakingUp] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

    (async () => {
      let delay = 1000; // 1 секунда
      for (let i = 0; i < 5 && !cancelled; i++) {
        try {
          await apiClient.get("/"); // обращаемся к бекенду
          if (!cancelled) {
            setIsWakingUp(false);
          }
          return;
        } catch {
          console.log(`Wake-up attempt ${i + 1} failed, retrying in ${delay}ms`);
          await sleep(delay);
          delay *= 2;
        }
      }
      if (!cancelled) {
        // всё-таки не ответил после 5 попыток
        setIsWakingUp(false);
        dispatch(showNotification("Сервер грузится. Подождем немного...", "error", 5));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return isWakingUp;
}
