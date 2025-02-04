"use server";
import { genAI } from "@/lib/gemini";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export async function generateQuizQuestion(): Promise<QuizQuestion> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  // Modify the prompt to be more explicit about JSON formatting
  const prompt = `
  Generate an English language quiz question and return it in valid JSON format.
  The response must be a single JSON object with exactly these fields:
  {
    "question": "string with the question text",
    "options": ["array with exactly 4 string options - make sure to thoroughly shuffle/randomize these options"],
    "correctAnswer": "string matching one of the options exactly",
    "explanation": "string explaining the answer"
  }
  The question should focus on English vocabulary or grammar and be suitable for intermediate learners.
  Guidelines:
  - Ensure the options are thoroughly randomized/shuffled
  - Do not include letter labels (A, B, C, D) in the options
  - The correct answer should appear in a random position, not always first
  Important: Return ONLY the JSON object, no additional text or formatting.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response text to ensure it's valid JSON
    const cleanedText = text
      .trim()
      // Remove any potential markdown code block markers
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    try {
      const quizQuestion = JSON.parse(cleanedText) as QuizQuestion;

      // Validate the response structure
      if (
        !quizQuestion.question ||
        !Array.isArray(quizQuestion.options) ||
        quizQuestion.options.length !== 4 ||
        !quizQuestion.correctAnswer ||
        !quizQuestion.explanation
      ) {
        throw new Error("Invalid quiz question format");
      }

      // Verify that correctAnswer exists in options
      if (!quizQuestion.options.includes(quizQuestion.correctAnswer)) {
        throw new Error("Correct answer not found in options");
      }

      return quizQuestion;
    } catch (parseError) {
      console.error(
        "JSON parsing error:",
        parseError,
        "Raw text:",
        cleanedText
      );
      throw new Error("Failed to parse quiz question JSON");
    }
  } catch (error) {
    console.error("Error generating quiz question:", error);
    throw new Error("Failed to generate quiz question");
  }
}
