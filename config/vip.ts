export const VIP_FEE = 1500;
export const VIP_DISCOUNT_PERCENT = 15;
export const vipBenefits = [
  { title: "15% off every product", text: "Your lifetime discount applies automatically when you sign in. Delivery charges and membership fees are excluded." },
  { title: "Priority order handling", text: "VIP orders are flagged for priority booking requests, subject to available delivery slots. Preferred times are requests, not guarantees." },
  { title: "Complimentary custom note cards", text: "Add your personal message at checkout and we’ll include a note card with your order." },
  { title: "Members-only early access", text: "Shop products marked for VIP early access before they open to everyone. Availability varies by collection." },
];

export function vipDiscount(subtotal: number, active: boolean) {
  return active ? Math.round(subtotal * VIP_DISCOUNT_PERCENT) / 100 : 0;
}

export function normalizePhone(value: string) {
  const digits = value.replace(/[\s()+-]/g, "").replace(/^00880/, "880");
  const phone = digits.startsWith("01") ? `88${digits}` : digits;
  return /^8801[3-9]\d{8}$/.test(phone) ? `+${phone}` : null;
}

// Bangladesh calendar dates: minimum four days, regardless of the server timezone.
export function earliestDeliveryDate(now = new Date()) {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 4);
  return date.toISOString().slice(0, 10);
}

export function validDeliveryDate(value: unknown, now = new Date()) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value && value >= earliestDeliveryDate(now);
}
