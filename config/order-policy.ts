export const deliveryCharges = { inside: 190, outside: 350 } as const;

export const additionalItemDeliveryCharge = 100;
export const additionalItemDeliveryMessage = `Delivery includes the first item. Each additional item adds ৳${additionalItemDeliveryCharge} unless the order qualifies for free delivery.`;

export const freeDeliveryThreshold = 2500;
export const freeDeliveryMessage = `Free delivery inside Dhaka on orders over ৳${freeDeliveryThreshold.toLocaleString("en-BD")} after discounts.`;

export function getDeliveryCharge(zone: keyof typeof deliveryCharges, discountedSubtotal: number, unitCount: number) {
  if (unitCount === 0) return 0;
  return zone === "inside" && Math.round(discountedSubtotal * 100) > freeDeliveryThreshold * 100
    ? 0
    : deliveryCharges[zone] + (unitCount - 1) * additionalItemDeliveryCharge;
}

export const orderPolicies = [
  { title: "Advance notice", text: "All orders must be placed at least 4 days before the scheduled delivery or event date." },
  { title: "Payment", text: "No Cash on Delivery. Full or partial advance payment is required to confirm your order. Online checkout requires full payment; contact us to arrange a partial advance." },
  { title: "Returns", text: "Fresh floral arrangements and custom handmade items cannot be returned." },
];
