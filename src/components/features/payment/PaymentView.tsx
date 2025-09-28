// src/components/features/payment/PaymentView.tsx
"use client";

import Link from "next/link";
import { BASE_PRICES } from "@/data/payment";
import Notification from "@features/common/Notification";

export default function PaymentView({
  paymentType,
  setPaymentType,
  couponCode,
  setCouponCode,
  preview,
  loading,
  error,
  onCheckCoupon,
  onSubmit,
  unsubscribe,
  isUnsubmitting,
}: {
  paymentType: PaymentType;
  setPaymentType: (t: PaymentType) => void;
  couponCode: string;
  setCouponCode: (v: string) => void;
  preview: CouponPreview | null;
  loading: boolean;
  error: string;
  onCheckCoupon: () => void;
  onSubmit: (e: React.FormEvent) => void;
  unsubscribe: (plan: "monthly" | "yearly") => Promise<void>;
  isUnsubmitting: boolean;
}) {
  const basePrice = BASE_PRICES[paymentType];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-8">
      <Notification />
      {/* Навигация */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <Link
          href="/"
          className="text-base sm:text-lg text-white bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          На главную
        </Link>
      </div>

      {/* Форма оплаты */}
      <form onSubmit={onSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Выберите подписку</h2>

        <div className="space-y-3">
          {[
            { id: "monthly", label: "Месячная", value: "monthly" as PaymentType },
            { id: "yearly", label: "Годовая", value: "yearly" as PaymentType },
            { id: "forever", label: "Бессрочная", value: "forever" as PaymentType },
          ].map(option => (
            <label
              key={option.id}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
            >
              <input
                type="radio"
                id={option.id}
                value={option.value}
                checked={paymentType === option.value}
                onChange={e => setPaymentType(e.target.value as PaymentType)}
                className="w-5 h-5 text-blue-500 focus:ring-blue-400 border-gray-300"
              />
              <span className="text-gray-800">{option.label}</span>
            </label>
          ))}
        </div>

        {/* Инпут + кнопка: стакаем на мобиле, в ряд на ≥sm */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-stretch">
          <input
            type="text"
            value={couponCode}
            onChange={e => setCouponCode(e.target.value)}
            className="w-full min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
            placeholder="Промокод"
            inputMode="text"
            autoCapitalize="off"
            autoCorrect="off"
          />
          <button
            type="button"
            onClick={onCheckCoupon}
            disabled={!couponCode.trim()}
            className={`w-full sm:w-auto whitespace-nowrap px-4 py-2 rounded-lg text-white transition ${
              couponCode.trim() ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Проверить
          </button>
        </div>

        {/* Превью цены */}
        <div className="mt-3 text-sm">
          {!couponCode && (
            <p className="text-gray-700">
              Итого: <b>{basePrice} ₽</b>
            </p>
          )}

          {!!couponCode && preview && preview.valid && (
            <p className="text-gray-700">
              Итого: <span className="line-through">{preview.base_amount} ₽</span>{" "}
              <b>{preview.final_amount} ₽</b>{" "}
              <span className="text-green-600">({`−${preview.discount_percentage}%`})</span>
            </p>
          )}

          {!!couponCode && preview && !preview.valid && (
            <p className="text-red-600">
              Купон не применим: {preview.error}{" "}
              {typeof preview.base_amount === "number" ? `(база: ${preview.base_amount} ₽)` : null}
            </p>
          )}
        </div>

        {/* Подсказки по промокодам (для тестов) */}
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1 text-center">Промокоды для теста:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { code: "Январь", hint: "Monthly → −5%" },
              { code: "Декабрь", hint: "Yearly → −10%" },
              { code: "Февраль", hint: "Forever → −15%" },
            ].map(p => (
              <button
                key={p.code}
                type="button"
                onClick={() => setCouponCode(p.code)}
                className="px-2 py-1 rounded-full text-xs bg-gray-200 hover:bg-gray-300 text-gray-800"
                title={p.hint}
              >
                {p.code}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-3 text-white font-semibold rounded-lg ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 transition"
          }`}
        >
          {loading ? "Обработка..." : "Оплата"}
        </button>
      </form>

      {/* Тестовые карты */}
      <div className="bg-blue-50 p-4 rounded-lg mt-6 w-full max-w-lg">
        <h2 className="text-sm font-semibold text-gray-700 mb-2 text-center">
          Проведите тестовые платежи с помощью:
        </h2>
        <div className="text-sm text-gray-800 text-center mb-2">
          Номер карты: 5555 5555 5555 4444
        </div>
        <p className="text-xs text-gray-500 text-center">
          Дата карты — <span className="font-semibold">12/29</span>, CVC —{" "}
          <span className="font-semibold">123</span>
        </p>
      </div>

      {/* Управление подпиской */}
      <div className="mt-6 w-full max-w-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">
          Управление подпиской
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            type="button"
            onClick={() => unsubscribe("monthly")}
            disabled={isUnsubmitting}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400"
            title="Отменить месячную подписку"
          >
            Отписаться от Monthly
          </button>
          <button
            type="button"
            onClick={() => unsubscribe("yearly")}
            disabled={isUnsubmitting}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400"
            title="Отменить годовую подписку"
          >
            Отписаться от Yearly
          </button>
        </div>
      </div>
    </div>
  );
}
