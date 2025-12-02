"use client";
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function LanguageSelector() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = (lang: string) => {
    const langCode = lang === "bangla" ? "bn" : "en";
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    }
  };

  if (!mounted) return null;

  return (
    <Select onValueChange={changeLanguage}>
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="bangla">Bangla</SelectItem>
        <SelectItem value="english">English</SelectItem>
      </SelectContent>
    </Select>
  );
}
