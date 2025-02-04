"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateQuizQuestion } from "../actions/quizz";
import { Loader2, Trophy } from "lucide-react";
import { translateText } from "../actions/translateText";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export default function EnglishQuiz() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  // const [totalQuestions, setTotalQuestions] = useState(0);
  const [ptExplanation, setPtExplanation] = useState("");
  const [ptCorrectAnswer, setPtCorrectAnswer] = useState("");

  const fetchNewQuestion = async () => {
    setIsLoading(true);
    try {
      const newQuestion = await generateQuizQuestion();
      const translationResult = await translateText(
        newQuestion.explanation,
        "English",
        "Portuguese"
      );
      setPtExplanation(translationResult.translation);
      setQuestion(newQuestion);
      setSelectedAnswer(null);
      setIsAnswered(false);
      // setTotalQuestions((prev) => prev + 1);
      setPtCorrectAnswer(""); // Limpa a tradução da resposta anterior
    } catch (error) {
      console.error("Error fetching question:", error);
    }
    setIsLoading(false);
  };

  const handleAnswer = async () => {
    if (selectedAnswer === question?.correctAnswer) {
      setScore((prev) => prev + 1);
    }
    setIsAnswered(true);

    // Traduz a resposta correta quando o usuário responde
    try {
      const translationResult = await translateText(
        question?.correctAnswer || "",
        "English",
        "Portuguese"
      );
      setPtCorrectAnswer(translationResult.translation);
    } catch (error) {
      console.error("Error translating answer:", error);
    }
  };

  useEffect(() => {
    fetchNewQuestion();
  }, []);

  const handleNextQuestion = () => {
    fetchNewQuestion();
  };

  if (!question) {
    return (
      <div className="bg-white dark:bg-background dark:text-white rounded-md p-10 animate-pulse text-center font-medium">
        Gerando Quizz com AI...
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto relative">
      <CardHeader>
        <CardTitle>English Learning Quiz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-left flex items-center gap-x-2">
          <Trophy size={16} className="mb-1" /> Score: {score}
          {/* /
          {totalQuestions - 1} */}
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">{question.question}</h3>
          <RadioGroup
            disabled={isAnswered}
            value={selectedAnswer || ""}
            onValueChange={setSelectedAnswer}
          >
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`
                  flex items-center space-x-2 p- rounded-lg transition-colors
                  ${
                    !isAnswered
                      ? "hover:bg-slate-100 dark:hover:bg-secondary"
                      : ""
                  }
                  ${
                    isAnswered && option === question.correctAnswer
                      ? "bg-green-100"
                      : ""
                  }
                  ${
                    isAnswered &&
                    option === selectedAnswer &&
                    option !== question.correctAnswer
                      ? "bg-red-100"
                      : ""
                  }
                `}
              >
                <RadioGroupItem
                  value={option}
                  id={`option-${index}`}
                  className="ml-3
                    [&[data-state=checked]]:bg-blue-500
                    [&[data-state=checked]]:border-blue-500
                    [&:disabled][data-state=checked]:opacity-100
                    [&:disabled][data-state=unchecked]:opacity-50"
                />
                <Label
                  htmlFor={`option-${index}`}
                  className={`py-3 w-full h-full cursor-pointer
                    ${
                      isAnswered && option === question.correctAnswer
                        ? "font-medium text-green-800"
                        : ""
                    }
                    ${
                      isAnswered &&
                      option === selectedAnswer &&
                      option !== question.correctAnswer
                        ? "font-medium text-red-800"
                        : ""
                    }
                    ${isAnswered ? "cursor-default" : ""}`}
                >
                  {option}
                  {isAnswered &&
                    option === question.correctAnswer &&
                    ptCorrectAnswer && (
                      <span className="block text-sm text-black dark:text-background mt-1">
                        ({ptCorrectAnswer})
                      </span>
                    )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        {!isAnswered ? (
          <Button
            size="lg"
            className="w-full dark:text-white"
            onClick={handleAnswer}
            disabled={!selectedAnswer || isLoading}
          >
            Submit Answer
          </Button>
        ) : (
          <div className="space-y-3 relative">
            <span className="font-semibold">Explanation:</span>
            <p className="bg-gray-50 dark:bg-background p-2 border rounded-md">
              {question.explanation}
            </p>
            <p className="bg-gray-50 dark:bg-background p-2 border rounded-md">
              {ptExplanation}
            </p>
            <div className="bg-background sticky bottom-0 py-5">
              <Button
                size="lg"
                className="w-full dark:bg-primary dark:text-white"
                onClick={handleNextQuestion}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Next Question"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
