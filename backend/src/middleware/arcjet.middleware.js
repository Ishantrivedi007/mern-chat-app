import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (request, response, next) => {
  try {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return response.status(429).json({
          success: false,
          message: "Rate limit exceeded. Please try again later.",
        });
      } else if (decision.reason.isBot()) {
        return response.status(403).json({
          success: false,
          message: "Bot access denied.",
        });
      } else {
        return response.status(403).json({
          success: false,
          message: "Access denied by security policy.",
        });
      }
    }

    //check for spoofed bots
    if (decision.results.some(isSpoofedBot)) {
      return response.status(403).json({
        success: false,
        error: "Spoofed bot detected. Access denied.",
        message: "Malicious bot detected. Access denied.",
      });
    }
    next();
  } catch (error) {
    console.log("ArcJet Protection error: ", error);
    next();
  }
};
