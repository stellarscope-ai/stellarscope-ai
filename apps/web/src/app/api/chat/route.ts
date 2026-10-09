import { NextResponse } from "next/server";
import { createOrchestrator, NoopProvider, createAccountLookupHandler, createTxSummaryHandler, createTransactionDetailsHandler, createAssetActivityHandler, accountLookupDefinition, txSummaryDefinition, transactionDetailsDefinition, assetActivityDefinition } from "@stellarscope/ai";
import type { ChatMessage } from "@stellarscope/ai";

export async function POST(request: Request) {
  try {
    const { messages } = (await request.json()) as { messages: ChatMessage[] };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const providerName = process.env.AI_PROVIDER ?? "noop";

    let provider;
    if (providerName === "google") {
      const { GoogleAIProvider } = await import("@stellarscope/ai");
      provider = new GoogleAIProvider();
    } else {
      provider = new NoopProvider();
    }

    const orchestrator = createOrchestrator({ provider });

    orchestrator.registerTool({ definition: accountLookupDefinition, handler: createAccountLookupHandler() });
    orchestrator.registerTool({ definition: txSummaryDefinition, handler: createTxSummaryHandler() });
    orchestrator.registerTool({ definition: transactionDetailsDefinition, handler: createTransactionDetailsHandler() });
    orchestrator.registerTool({ definition: assetActivityDefinition, handler: createAssetActivityHandler() });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of orchestrator.chat(messages)) {
            if (chunk.type === "text" && chunk.content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", content: chunk.content })}\n\n`));
            } else if (chunk.type === "tool_call" && chunk.toolCall) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "tool_call", name: chunk.toolCall.name })}\n\n`));
            } else if (chunk.type === "done") {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
            }
          }
        } catch (err) {
          const error = err as { message?: string };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", content: error.message ?? "Stream error" })}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const error = err as { message?: string };
    return NextResponse.json(
      { error: error.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}