import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST() {
  try {
    // 1. Execute lightweight ping
    const { error: pingErr } = await supabase
      .from("site_config")
      .select("id")
      .limit(1);

    const status = pingErr ? "error" : "success";
    const now = new Date();

    // 2. Record manual ping into ping_history
    await supabase.from("ping_history").insert([
      {
        pinged_at: now.toISOString(),
        type: "manual",
        status: status,
      },
    ]);

    // 3. Reset next_ping_date to +6 days from today
    const nextDateObj = new Date();
    nextDateObj.setDate(nextDateObj.getDate() + 6);
    const newNextPingDate = nextDateObj.toISOString().split("T")[0];

    // 4. Update site_config
    const { data: config } = await supabase
      .from("site_config")
      .select("id")
      .limit(1)
      .single();

    if (config?.id) {
      await supabase
        .from("site_config")
        .update({ next_ping_date: newNextPingDate })
        .eq("id", config.id);
    }

    return NextResponse.json({
      success: true,
      status,
      pinged_at: now.toISOString(),
      next_ping_date: newNextPingDate,
      message: `Supabase berhasil di-ping manual. Jadwal ping berikutnya di-reset menjadi ${newNextPingDate} (+6 hari).`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Manual ping failed";
    console.error("Manual ping error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
