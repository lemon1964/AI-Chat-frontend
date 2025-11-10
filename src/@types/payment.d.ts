// src/@types/payment.d.ts
type PaymentType = "monthly" | "yearly" | "forever";

type CouponPreview =
  | {
      valid: true;
      base_amount: number;
      final_amount: number;
      discount_percentage: number;
    }
  | {
      valid: false;
      base_amount: number;
      error?: string;
    };