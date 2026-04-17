import { type FactSheet } from "@terra-oracle/terra-oracle";

export async function getAgriAdvisory(factSheet: FactSheet): Promise<string> {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
  if (!apiKey) throw new Error("Missing API Key");

  // Switched to stable /v1/ endpoint to resolve 404 Model Not Found issues
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{
      parts: [{
        text: `Analyze this field report for ${factSheet.crop_name}: ${JSON.stringify(factSheet)}. Provide expert agronomic advice in Markdown.`
      }]
    }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || `API Error ${response.status}`);
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No advisory generated.";
  } catch (err: any) {
    throw new Error(`Oracle Advisory Failure: ${err.message}`);
  }
}
