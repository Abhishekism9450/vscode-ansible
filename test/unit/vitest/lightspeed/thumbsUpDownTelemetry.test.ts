import { describe, it, expect, vi } from "vitest";
import type { PlaybookFeedbackEvent } from "../../../../src/interfaces/lightspeed";
import { ThumbsUpDownAction } from "../../../../src/definitions/lightspeed";
import { PROVIDER_TYPES, MODEL_NAMES } from "./testConstants";
import { sendTelemetry } from "../../../../src/utils/telemetryUtils";
import type { TelemetryService } from "@redhat-developer/vscode-redhat-telemetry/lib";

describe("Playbook Thumbs Up Telemetry", () => {
  it("should send telemetry for playbook explanation thumbs up", async () => {
    const provider = PROVIDER_TYPES.GOOGLE;
    const modelName = MODEL_NAMES.GEMINI_25_FLASH;
    const param: PlaybookFeedbackEvent = {
      action: ThumbsUpDownAction.UP,
      explanationId: "exp-123",
    };

    // Build telemetry data as per extension.ts logic
    const isExplanation = !!param.explanationId;
    const eventName = isExplanation
      ? "lightspeed.playbookExplanationFeedback"
      : "lightspeed.playbookOutlineFeedback";

    const telemetryData = {
      provider: provider,
      action: param.action,
      explanationId: param.explanationId || undefined,
      generationId: param.generationId || undefined,
      model: modelName || undefined,
    };

    // Create mock telemetry service
    const mockTelemetryService = {
      send: vi.fn().mockResolvedValue(undefined),
    } as unknown as TelemetryService;

    // Call the REAL sendTelemetry function
    await sendTelemetry(
      mockTelemetryService,
      true,
      eventName,
      telemetryData,
    );

    // Verify the real sendTelemetry function called telemetryService.send
    expect(mockTelemetryService.send).toHaveBeenCalledTimes(1);
    expect(mockTelemetryService.send).toHaveBeenCalledWith({
      name: "lightspeed.playbookExplanationFeedback",
      properties: {
        provider: PROVIDER_TYPES.GOOGLE,
        action: ThumbsUpDownAction.UP,
        explanationId: "exp-123",
        model: MODEL_NAMES.GEMINI_25_FLASH,
        generationId: undefined,
      },
    });
  });
});

