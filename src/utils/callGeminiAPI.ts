// NOTE: You must provide your Gemini API key below for AI features to work.

const callGeminiAPI = async (prompt: string): Promise<string> => {
  const apiKey = ""; // <-- Your Gemini API key here
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
    const result = await response.json();
    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
      return result.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected API response structure:", result);
      return "Could not retrieve a valid response from the AI.";
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "An error occurred while contacting the AI service.";
  }
};

export default callGeminiAPI;
