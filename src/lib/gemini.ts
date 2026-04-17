import { type FactSheet } from "@terra-oracle/terra-oracle";

export async function getAgriAdvisory(factSheet: FactSheet): Promise<string> {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
  if (!apiKey) throw new Error("Missing API Key");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;
  const prompt = `Analyze this field report for ${factSheet.crop_name}: ${JSON.stringify(factSheet)}. Respond as an expert agronomist. Use Markdown formatting.`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  // Logic: Most AI Studio keys are AIza... and work via ?key=
  // Some Cloud keys/Tokens work via Authorization header.
  const tryFetch = async (useHeader: boolean) => {
    const fetchUrl = useHeader ? url : `${url}?key=${apiKey}`;
    const headers: any = { 'Content-Type': 'application/json' };
    if (useHeader) headers['Authorization'] = `Bearer ${apiKey}`;

    const res = await fetch(fetchUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || `Status ${res.status}`);
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  };

  try {
    // Attempt 1: Standard API Key
    return await tryFetch(false);
  } catch (err1: any) {
    console.warn("Standard Auth failed, trying Bearer...", err1.message);
    try {
      // Attempt 2: Bearer Token Fallback
      return await tryFetch(true);
    } catch (err2: any) {
      // Both failed - Provide specific feedback
      throw new Error(`Authentication Failed. Your key might be expired or restricted. Details: ${err2.message}`);
    }
  }
}
