import { type FactSheet } from "@terra-oracle/terra-oracle";

export async function getAgriAdvisory(factSheet: FactSheet): Promise<string> {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
  if (!apiKey) throw new Error("Missing API Key");

  // Priortizing Gemini 3 IDs as seen in your specific dashboard legend
  const modelsToTry = ["gemini-3-flash", "gemini-3-flash-preview", "gemini-1.5-flash", "gemini-pro"];
  let lastError = "";

  for (const modelId of modelsToTry) {
    try {
      // Switched back to v1beta for preview model support
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
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

  throw new Error(`Oracle Node failure. Last reason: ${lastError}`);
}
