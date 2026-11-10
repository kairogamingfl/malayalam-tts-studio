import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ALLOWED_SPEAKERS = new Set(["shubh", "pooja"]);

export async function POST(request: Request) {
  try {
    const apiKey = process.env.SARVAM_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "SARVAM_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const text =
      typeof body.text === "string" ? body.text.trim() : "";

    const speaker =
      typeof body.speaker === "string" ? body.speaker : "shubh";

    const pace = Number(body.pace ?? 1);
    const temperature = Number(body.temperature ?? 0.7);

    if (!text) {
      return NextResponse.json(
        { error: "Please enter Malayalam text." },
        { status: 400 }
      );
    }

    if (text.length > 2500) {
      return NextResponse.json(
        { error: "Maximum text length is 2,500 characters." },
        { status: 400 }
      );
    }

    if (!ALLOWED_SPEAKERS.has(speaker)) {
      return NextResponse.json(
        { error: "Invalid voice selected." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(pace) || pace < 0.5 || pace > 2) {
      return NextResponse.json(
        { error: "Speed must be between 0.5 and 2." },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(temperature) ||
      temperature < 0.01 ||
      temperature > 1
    ) {
      return NextResponse.json(
        { error: "Temperature must be between 0.01 and 1." },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.sarvam.ai/text-to-speech",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": apiKey
        },
        body: JSON.stringify({
          text,
          model: "bulbul:v3",
          language_code: "ml-IN",
          speaker,
          pace,
          temperature,
          speech_sample_rate: 24000,
          output_audio_codec: "mp3"
        }),
        cache: "no-store"
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            result?.message ||
            result?.detail ||
            "The speech provider could not generate audio."
        },
        { status: response.status }
      );
    }

    const audio = result?.audios?.[0];

    if (typeof audio !== "string" || !audio) {
      return NextResponse.json(
        { error: "No audio was returned by the speech provider." },
        { status: 502 }
      );
    }

    return NextResponse.json({ audio });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
      }
