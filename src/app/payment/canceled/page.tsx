// src/app/payment/canceled/page.tsx
import InfoScreen from "@ui/status/InfoScreen";

export default function PaymentCanceled() {
  return (
    <InfoScreen
      title="Оплата отменена"
      message="Перенаправляемся на домашнюю страницу…"
      redirectTo="/"
      redirectAfterSec={3}
      tone="warning"
    />
  );
}
