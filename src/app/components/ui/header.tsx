import { ModeToggle } from "@/components/toggleTheme";
import { SparklesText } from "@/components/ui/sparkles-text";
import { Bot } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="flex sticky top-0 p-4 items-center justify-between w-full bg-blue-500 dark:bg-blue-700 z-20">
      <div className="items-center justify-between flex w-full container mx-auto ">
        <div className="flex items-center gap-2 text-white dark:text-white ">
          <Bot size={40} />
          <div>
            <SparklesText
              className="text-lg sm:text-2xl"
              text="English Learning AI"
            />
            <h1 className="text-white mr-auto -mt-1 text-xs">
              Developed by{" "}
              <Link
                href="https://rafaelbarros.vercel.app/"
                className="font-semibold underline"
                target="_blank"
                referrerPolicy="no-referrer"
              >
                Rafael Barros
              </Link>
            </h1>
          </div>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
