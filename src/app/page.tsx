import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnglishQuiz from "./components/englishQuizz";
import EnglishLearningAI from "./components/englishLearningAI";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <main className="flex min-h-full flex-col bg-blue-500 dark:bg-blue-700 items-center justify-center p-4 relative">
      <Tabs
        defaultValue="translate"
        className="w-full sm:max-w-[400px] xl:max-w-xl z-10 h-fit "
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="translate">Translate</TabsTrigger>
          <TabsTrigger value="quizz">English Quizz AI</TabsTrigger>
        </TabsList>
        <ScrollArea
          className="
         mt-2 rounded-md  h-[70dvh]"
        >
          <TabsContent value="translate" className="mt-0 ">
            <EnglishLearningAI />
          </TabsContent>
          <TabsContent value="quizz" className="mt-0">
            <EnglishQuiz />
          </TabsContent>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </Tabs>
    </main>
  );
}
