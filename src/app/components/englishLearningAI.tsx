"use client";

import { ChangeEvent, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { translateAndGetTips } from "../actions/translate";
import { Languages, Loader2, Speech, FastForward, Rewind } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { translateText } from "../actions/translateText";

export default function EnglishLearningAI() {
  const [inputText, setInputText] = useState("");
  const [translation, setTranslation] = useState("");
  const [tips, setTips] = useState("");
  const [ptTips, setPtTips] = useState(""); // Dicas em português
  const [isLoading, setIsLoading] = useState(false);
  const [speechRate, setSpeechRate] = useState(1); // Taxa de velocidade da fala (1 é normal)

  const handleTranslate = async () => {
    setIsLoading(true);
    try {
      const result = await translateAndGetTips(inputText);
      const ptTips = await translateText(result.tips, "English", "Portuguese");
      setTranslation(result.translation);
      setTips(result.tips);
      setPtTips(ptTips.translation);
      // Aqui você precisará modificar sua API para retornar também as dicas em português
    } catch (error) {
      console.error("Translation error:", error);
      setTranslation("Error occurred during translation");
      setTips("");
      setPtTips("");
    }
    setIsLoading(false);
  };

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(translation);
    utterance.lang = "en-US";
    utterance.rate = speechRate;
    speechSynthesis.speak(utterance);
  };

  const adjustSpeechRate = (adjustment: number) => {
    setSpeechRate((prev) => {
      const newRate = Math.max(0.5, Math.min(2, prev + adjustment));
      return Number(newRate.toFixed(1));
    });
  };

  const id = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const defaultRows = 3;
  const maxRows = 10;

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";

    const style = window.getComputedStyle(textarea);
    const borderHeight =
      parseInt(style.borderTopWidth) + parseInt(style.borderBottomWidth);
    const paddingHeight =
      parseInt(style.paddingTop) + parseInt(style.paddingBottom);

    const lineHeight = parseInt(style.lineHeight);
    const maxHeight = maxRows
      ? lineHeight * maxRows + borderHeight + paddingHeight
      : Infinity;

    const newHeight = Math.min(textarea.scrollHeight + borderHeight, maxHeight);

    textarea.style.height = `${newHeight}px`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Translate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Textarea
            value={inputText}
            id={id}
            placeholder="Digite uma frase em português..."
            ref={textareaRef}
            onChange={handleInput}
            rows={defaultRows}
            className="min-h-[none] resize-none"
          />
          <Button
            size="lg"
            className="w-full dark:bg-primary dark:text-white"
            onClick={handleTranslate}
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Languages className="mr-2" /> Traduzir
              </>
            )}
          </Button>
        </div>
        {translation && (
          <div className="space-y-2">
            <h3 className="font-semibold">Tradução:</h3>
            <p className="bg-gray-50 dark:bg-background p-2 border rounded-md">
              {translation}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustSpeechRate(-0.1)}
                className="dark:bg-primary dark:text-white"
              >
                <Rewind className="h-4 w-4" />
              </Button>
              <Button
                className="dark:bg-primary dark:text-white"
                onClick={handleSpeak}
              >
                <Speech className="mr-2" />
                Ouvir ({speechRate}x)
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustSpeechRate(0.1)}
                className="dark:bg-primary dark:text-white"
              >
                <FastForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        {tips && (
          <div className="space-y-2">
            <h3 className="font-semibold">Dicas:</h3>
            <div className="space-y-2">
              <p className="bg-gray-50 dark:bg-background p-2 border rounded-md">
                {tips}
              </p>
              <p className="bg-gray-50 dark:bg-background p-2 border rounded-md">
                {ptTips}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
