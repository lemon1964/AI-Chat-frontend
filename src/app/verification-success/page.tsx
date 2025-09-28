// src/app/verification-success/page.tsx
import InfoScreen from "@ui/status/InfoScreen";

export default function VerificationSuccess() {
  return (
    <InfoScreen
      title="Электронная почта подтверждена!"
      message="Отправляемся на домашнюю страницу…"
      redirectTo="/"
      redirectAfterSec={3}
      tone="success"
    />
  );
}

