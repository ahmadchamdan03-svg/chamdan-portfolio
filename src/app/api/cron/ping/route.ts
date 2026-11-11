import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // 1. Fetch current site config
    const { data: config, error: configError } = await supabase
      .from("site_config")
      .select("id, next_ping_date")
      .limit(1)
      .single();

    if (configError && configError.code !== "PGRST116") {
      throw configError;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const nextPingDate = config?.next_ping_date;

    // 2. Check if ping is due (if next_ping_date is null or <= today)
    const isDue = !nextPingDate || todayStr >= nextPingDate;

    if (!isDue) {
      return NextResponse.json({
        pinged: false,
        message: "Supabase ping is not due yet.",
        today: todayStr,
        next_ping_date: nextPingDate,
      });
    }

    // 3. Execute lightweight Supabase ping query
    const { error: pingErr } = await supabase
      .from("site_config")
      .select("id")
      .limit(1);

    const pingStatus = pingErr ? "error" : "success";

    // 4. Record to ping_history
    await supabase.from("ping_history").insert([
      {
        pinged_at: new Date().toISOString(),
        type: "auto",
        status: pingStatus,
      },
    ]);

    // 5. Calculate next ping date (+6 days from today)
    const nextDateObj = new Date();
    nextDateObj.setDate(nextDateObj.getDate() + 6);
    const newNextPingDate = nextDateObj.toISOString().split("T")[0];

    // 6. Update site_config with new next_ping_date
    if (config?.id) {
      await supabase
        .from("site_config")
        .update({ next_ping_date: newNextPingDate })
        .eq("id", config.id);
    }

    return NextResponse.json({
      pinged: true,
      type: "auto",
      status: pingStatus,
      today: todayStr,
      next_ping_date: newNextPingDate,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Cron ping failed";
    console.error("Cron ping error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
