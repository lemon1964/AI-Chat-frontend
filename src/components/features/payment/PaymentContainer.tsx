// src/components/features/payment/PaymentContainer.tsx
"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { getSession } from "next-auth/react";
import PaymentView from "./PaymentView";
import { AppDispatch } from "@/store/store";
import { showNotification } from "@/reducers/notificationReducer";

type ApiErrorPayload = { error?: string; detail?: string; message?: string } | string | null;

// ленивый импорт apiClient, чтобы не словить цикл store <-> chatApi <-> authClientService
async function post(url: string, data?: unknown, token?: string) {
  const { default: apiClient } = await import("@/services/authClientService");
  return apiClient.post(
    url,
    data,
    token
      ? { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      : undefined
  );
}

export default function PaymentContainer() {
  const dispatch = useDispatch<AppDispatch>();
  const [paymentType, setPaymentType] = useState<PaymentType>("forever");
  const [couponCode, setCouponCode] = useState("");
  const [preview, setPreview] = useState<CouponPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUnsubmitting, setUnsubmitting] = useState(false);

  const handleCheckCoupon = async () => {
    setError("");
    setPreview(null);

    try {
      const freshSession = await getSession();
      if (!freshSession?.accessToken) {
        setError("Требуется вход.");
        return;
      }

      const resp = await post(
        "/api/payment/validate-coupon/",
        {
          subscription_type: paymentType,
          coupon_code: couponCode,
        },
        freshSession.accessToken
      );

      const data = resp.data;
      if (data.valid) {
        setPreview({
          valid: true,
          base_amount: Math.round(Number(data.base_amount)),
          final_amount: Math.round(Number(data.final_amount)),
          discount_percentage: Number(data.discount_percentage),
        });
      } else {
        setPreview({
          valid: false,
          base_amount: Math.round(Number(data.base_amount ?? 0)),
          error: data.error,
        });
      }
    } catch {
      setError("Не удалось проверить купон. Попробуйте ещё раз.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const freshSession = await getSession();
      if (!freshSession?.accessToken) {
        setError("Нужно войти в аккаунт.");
        setLoading(false);
        return;
      }

      const resp = await post(
        "/api/payment/process-kassa/",
        { subscription_type: paymentType, coupon_code: couponCode },
        freshSession.accessToken
      );

      const data = resp.data;
      if (data.session_url) {
        window.location.href = data.session_url;
      } else {
        setError("Не удалось получить ссылку на оплату.");
        setLoading(false);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data;

        if (status === 409 && data?.next_charge_at) {
          const when = new Date(data.next_charge_at).toLocaleString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          setError(`У вас уже есть активная подписка «${data.plan}». Следующее списание: ${when}.`);
        } else if (status === 429) {
          setError(
            data?.error || "Платёж уже создаётся. Подождите пару секунд и обновите страницу."
          );
        } else if (status === 400) {
          setError(data?.error || "Некорректные данные. Проверьте форму.");
        } else {
          setError(data?.error || "Что-то пошло не так на стороне сервера. Попробуйте ещё раз.");
        }
      } else {
        setError("Неизвестная ошибка сети. Попробуйте ещё раз.");
      }
      setLoading(false);
    }
  };

  const unsubscribe = async (plan: "monthly" | "yearly") => {
    setUnsubmitting(true);
    try {
      const { default: apiClient } = await import("@/services/authClientService");
      await apiClient.post("/api/payment/unsubscribe/", { plan });
      dispatch(showNotification("Вы успешно отписались.", "success", 4));
    } catch (e) {
      let msg = "Не удалось выполнить отписку.";
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        const data = e.response?.data as ApiErrorPayload;
  
        if (status === 404) {
          msg = "У вас нет активной подписки этого типа.";
        } else if (typeof data === "string") {
          msg = data || msg;
        } else if (data && typeof data === "object") {
          msg = data.error ?? data.detail ?? data.message ?? msg;
        }
      }
      dispatch(showNotification(msg, "error", 5));
    } finally {
      setUnsubmitting(false);
    }
  };

  return (
    <PaymentView
      paymentType={paymentType}
      setPaymentType={t => {
        setPaymentType(t);
        setPreview(null); // сбрасываем превью при смене тарифа
      }}
      couponCode={couponCode}
      setCouponCode={setCouponCode}
      preview={preview}
      loading={loading}
      error={error}
      onCheckCoupon={handleCheckCoupon}
      onSubmit={handleSubmit}
      unsubscribe={unsubscribe}
      isUnsubmitting={isUnsubmitting}
    />
  );
}
