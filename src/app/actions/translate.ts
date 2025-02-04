"use server";
import { genAI } from "@/lib/gemini";

interface TranslationResult {
  translation: string;
  tips: string;
}

export async function translateAndGetTips(
  text: string
): Promise<TranslationResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `
    Analyze this Portuguese text and return ONLY a JSON object with exactly these fields:
    {
      "translation": "The English translation of the text",
      "tips": "A brief grammar or vocabulary tip related to the translation"
    }

    Portuguese text to translate: "${text}"

    Important instructions:
    1. Return ONLY the JSON object
    2. Do not add any additional text, markdown, or formatting
    3. Ensure the response is valid JSON
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Clean the response text to ensure valid JSON
    const cleanedText = responseText
      .trim()
      // Remove any potential markdown code block markers
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      // Remove any potential trailing commas
      .replace(/,(\s*[}\]])/g, "$1")
      .trim();

    try {
      const parsedResult = JSON.parse(cleanedText) as TranslationResult;

      // Validate the response structure
      if (!parsedResult.translation || !parsedResult.tips) {
        throw new Error("Invalid translation result format");
      }

      // Additional validation if needed
      if (
        typeof parsedResult.translation !== "string" ||
        typeof parsedResult.tips !== "string"
      ) {
        throw new Error("Invalid data types in translation result");
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
    throw new Error("Failed to translate and generate tips");
  }
}
