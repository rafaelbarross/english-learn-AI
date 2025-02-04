"use server";
import { genAI } from "@/lib/gemini";

interface TranslationResult {
  translation: string;
}

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `
    Translate this ${sourceLang} text to ${targetLang}.
    Return ONLY a JSON object in this format:
    {
      "translation": "The ${targetLang} translation of the text"
    }

    Text to translate: "${text}"

    Important instructions:
    1. Return ONLY the JSON object
    2. Do not add any additional text, markdown, or formatting
    3. Ensure the response is valid JSON
    4. The translation should maintain the original meaning while sounding natural
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Clean the response text
    const cleanedText = responseText
      .trim()
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .replace(/,(\s*[}\]])/g, "$1")
      .trim();

    try {
      const parsedResult = JSON.parse(cleanedText) as TranslationResult;

      if (
        !parsedResult.translation ||
        typeof parsedResult.translation !== "string"
      ) {
        throw new Error("Invalid translation result format");
      }

      return parsedResult;
    } catch (parseError) {
      console.error(
        "JSON parsing error:",
        parseError,
        "Raw text:",
        cleanedText
      );
      throw new Error("Failed to parse translation result");
    }
  } catch (error) {
    console.error("Error in translation:", error);
    if (error instanceof Error) {
      throw new Error(`Translation failed: ${error.message}`);
    }
    throw new Error("Failed to translate text");
  }
}
