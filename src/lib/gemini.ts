import { GoogleGenerativeAI } from "@google/generative-ai";
import { type FactSheet } from "@terra-oracle/terra-oracle";
import { CONFIG } from "./config";

export async function getAgriAdvisory(factSheet: FactSheet): Promise<string> {
  const apiKey = CONFIG.GEMINI_API_KEY.trim();
  if (!apiKey) throw new Error("Missing Gemini API Key in CONFIG");

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const persona = factSheet.subject_category === "ANIMAL" ? "expert livestock veterinarian" : "expert agronomist";
  const analysisType = factSheet.subject_category === "ANIMAL" ? "animal heat stress" : "crop thermal stress";

  const prompt = `
    You are a ${persona}.
    Analyze this ${analysisType} report for ${factSheet.subject_name}:
    DATA: ${JSON.stringify(factSheet)}

    CRITICAL INSTRUCTIONS:
    1. REGIONAL CONTEXT: Do not just compare data to biological ideals. Use the 'historical_comparison' and 'seasonal' data to determine if the current temperature is typical for this specific location.
    2. DIFFERENTIATE: If the heat is a regional norm (typical for this city), focus on "Standard Tropical Management" (e.g., mulching, irrigation timing).
    3. ALARMS: Only trigger "High Risk" warnings if the current temperature is a significant anomaly (>2°C) compared to the 3-year historical average for this month.
    4. ACTIONABLE: Provide 3 concrete management steps based on the local climate profile.
    
    Keep the tone professional, localized, and actionable. Use markdown.
  `;

  // 2026 Optimization: Use current-gen Gemini 3/2.5 models
  const modelsToTry = [
    "gemini-3-flash",
    "gemini-2.5-flash",
    "gemini-1.5-flash"
  ];
  let lastError = "";

  for (const modelId of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelId });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text() || "No advisory generated.";
    } catch (err: any) {
      lastError = err.message;
      console.warn(`[Gemini] Model ${modelId} failed:`, err.message);
      continue;
    }
  }

  throw new Error(`Oracle Node failure: All models failed. Last reason: ${lastError}`);
}
