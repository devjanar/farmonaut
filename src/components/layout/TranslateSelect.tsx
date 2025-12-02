"use client";
import { useEffect, useState } from "react";

export default function GoogleTranslateSelect() {
  const [lang, setLang] = useState("bn");

  // Inject Google Translate script
  useEffect(() => {
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    }

    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,bn",
          autoDisplay: true,
        },
        "google_translate_element"
      );
    };
  }, []);

  // Hide Google banner forever
  useEffect(() => {
    const hideGoogleBar = () => {
      const iframe = document.querySelector<HTMLIFrameElement>(
        "iframe.goog-te-banner-frame"
      );
      if (iframe) iframe.style.display = "none";

      const skipTranslate = document.querySelector<HTMLDivElement>(
        "body > .skiptranslate"
      );
      if (skipTranslate) skipTranslate.style.display = "none";

      document.body.style.top = "0px";
    };

    const observer = new MutationObserver(hideGoogleBar);
    observer.observe(document.body, { childList: true, subtree: true });

    const interval = setInterval(hideGoogleBar, 500);
    setTimeout(() => clearInterval(interval), 8000);

    return () => observer.disconnect();
  }, []);

  // Handle language change safely (wait until Google select exists)
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLang(newLang);

    const tryChange = () => {
      const googleSelect = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (googleSelect) {
        googleSelect.value = newLang;
        // Dispatch both native and synthetic events to trigger translation
        googleSelect.dispatchEvent(new Event("change", { bubbles: true }));
        googleSelect.dispatchEvent(new Event("input", { bubbles: true }));
        return true;
      }
      return false;
    };

    // Try repeatedly until Google dropdown is ready
    const maxTries = 20;
    let tries = 0;
    const interval = setInterval(() => {
      if (tryChange() || tries >= maxTries) clearInterval(interval);
      tries++;
    }, 300);
  };

  return (
    <div className="relative inline-block">
      {/* Hidden Google element */}
      <div id="google_translate_element" className="hidden"></div>

      {/* Custom styled dropdown */}
      <select
        value={lang}
        onChange={handleLanguageChange}
        className="w-[150px] appearance-none rounded-full border border-gray-300 bg-white py-2 px-4 text-sm text-gray-800 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="en">English</option>
        <option value="bn">বাংলা</option>
      </select>

      {/* Optional down arrow */}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
        ▼
      </span>
    </div>
  );
}
