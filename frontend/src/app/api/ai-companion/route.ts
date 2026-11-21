import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/server/backend";
import { backendTimeouts } from "@/lib/server/config";
import { authedBackendCall, withSession } from "@/lib/server/proxy";
import { asString, readJsonObject, rejectCrossOrigin } from "@/lib/server/request";

export const dynamic = "force-dynamic";
// Gemini round-trips can be slow; give the serverless function room beyond the 10s default.
export const maxDuration = 60;

const MESSAGE_MAX = 4000; // ChatInput.message max_length in backend/app/ai_contract.py
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Response of POST /api/v1/ai/chat (ChatOutput in backend/app/ai_contract.py). */
interface ChatOutput {
  conversationId: string;
  reply: string;
  suggestedFollowUps: string[];
  disclaimer: string;
}

/**
 * Frontend -> (this handler) -> main backend POST /api/v1/ai/chat -> Quaithe -> Gemini.
 * The backend builds the student context and keeps conversation history, keyed by `conversationId`.
 */
export async function POST(req: NextRequest) {
  const blocked = rejectCrossOrigin(req);
  if (blocked) return blocked;

  const body = await readJsonObject(req);
  const message = asString(body?.message).trim();
  const conversationId = asString(body?.conversationId);

  if (!message) return jsonError(400, "Message content is required.", "VALIDATION_ERROR");
  if (message.length > MESSAGE_MAX) {
    return jsonError(400, `Messages can be at most ${MESSAGE_MAX} characters.`, "VALIDATION_ERROR");
  }
  if (conversationId && !UUID_PATTERN.test(conversationId)) {
    return jsonError(400, "Invalid conversation.", "VALIDATION_ERROR");
  }

  return withSession(
    req,
    authedBackendCall<ChatOutput>("/ai/chat", {
      method: "POST",
      body: { message, ...(conversationId ? { conversationId } : {}) },
      timeoutMs: backendTimeouts.ai(),
    }),
    (result) => {
      const data = result.data;
      if (!data || typeof data.reply !== "string" || !data.reply) {
        return jsonError(502, "The AI Companion returned an unexpected response. Please try again.", "BAD_UPSTREAM_RESPONSE");
      }
      return NextResponse.json({
        success: true,
        message: data.reply,
        conversationId: data.conversationId,
        suggestedFollowUps: data.suggestedFollowUps ?? [],
        disclaimer: data.disclaimer,
        timestamp: new Date().toISOString(),
      });
    }
  );
}
