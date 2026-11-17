import { customerContext } from "@/lib/customer";

export async function GET() {
  try {
    const { user, membership } = await customerContext();
    return Response.json({ signedIn: !!user, vip: membership?.status === "active", phone: membership?.phone ?? null }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return Response.json({ error: "Unable to load membership. Please refresh before ordering." }, { status: 503 });
  }
}
