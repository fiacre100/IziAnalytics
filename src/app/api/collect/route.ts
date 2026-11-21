import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch (parseErr) {
      return NextResponse.json({ error: "Format JSON invalide" }, { status: 400 });
    }
    const { website_id, path, referrer, source, device, session_id, event_name, amount } = body;

    if (!website_id) {
      return NextResponse.json({ error: "website_id manquant" }, { status: 400 });
    }

    // Détection de pays par les en-têtes Vercel / Cloudflare si présents
    const country = req.headers.get("x-vercel-ip-country") || 
                    req.headers.get("cf-ipcountry") || 
                    "AF/FR";

    // Enregistrement sécurisé : si Supabase est configuré, on insère ; sinon mode démo gracieux
    try {
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        if (event_name && event_name !== "pageview") {
          await supabaseAdmin.from("conversions").insert([
            {
              website_id,
              session_id: session_id || "s_demo",
              event_name,
              amount: Number(amount) || 0,
            }
          ]);
        } else {
          await supabaseAdmin.from("pageviews").insert([
            {
              website_id,
              path: path || "/",
              referrer: referrer ? String(referrer).substring(0, 500) : "direct",
              source: source || "direct",
              country,
              device: device || "mobile",
              session_id: session_id || "s_demo",
            }
          ]);
        }
      }
    } catch (dbErr) {
      console.warn("DB offline ou non connectée (mode démo actif):", dbErr);
    }

    // Réponse rapide avec en-têtes CORS permissifs pour autoriser les sites clients
    return new NextResponse(JSON.stringify({ status: "tracked", mode: process.env.SUPABASE_SERVICE_ROLE_KEY ? "live" : "demo" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Erreur collecteur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
