import { type FactSheet } from "@terra-oracle/terra-oracle";

export async function getAgriAdvisory(factSheet: FactSheet): Promise<string> {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
  if (!apiKey) throw new Error("Missing API Key");

  // We list the most likely model aliases for your account
  const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];
  let lastError = "";

  for (const modelId of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1/models/${modelId}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{
          parts: [{ text: `Analyze this field report for ${factSheet.crop_name}: ${JSON.stringify(factSheet)}. Respond as an expert agronomist.` }]
        }]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (response.ok) {
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No advisory generated.";
      }
      lastError = data.error?.message || `Status ${response.status}`;
    } catch (err: any) {
      lastError = err.message;
    }
  }

  throw new Error(`All Oracle nodes reported 404/401. Last reason: ${lastError}`);
}
