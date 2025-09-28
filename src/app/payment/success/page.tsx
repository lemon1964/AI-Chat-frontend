// src/app/payment/success/page.tsx
import InfoScreen from "@ui/status/InfoScreen";

export default function PaymentCompleted() {
  return (
    <InfoScreen
      title="Платёж завершён!"
      message="Перенаправляемся на домашнюю страницу…"
      redirectTo="/"
      redirectAfterSec={3}
      tone="success"
    />
  );
}
