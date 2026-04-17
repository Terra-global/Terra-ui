import { type FactSheet } from "@terra-oracle/terra-oracle";

export async function getAgriAdvisory(factSheet: FactSheet): Promise<string> {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
  if (!apiKey) throw new Error("Missing API Key");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;
  
  const payload = {
    contents: [{
      parts: [{
        text: `Analyze this field report for ${factSheet.crop_name}: ${JSON.stringify(factSheet)}. Give a short expert advisory.`
      }]
    }]
  };

  // Tier 1: Try standard API Key header
  try {
    const response = await fetch(`${url}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    if (response.ok) return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    // Tier 2: If Tier 1 gave a 401, the key might be an Access Token (Bearer)
    if (response.status === 401) {
      const bearerResponse = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}` // Using it as an Access Token
        },
        body: JSON.stringify(payload)
      });
      const bearerData = await bearerResponse.json();
      return bearerData.candidates?.[0]?.content?.parts?.[0]?.text || "Bearer Auth Failed";
    }

    throw new Error(data.error?.message || "Unknown API Error");
  } catch (err: any) {
    throw new Error(`Auth Strategy Failed: ${err.message}`);
  }
}
