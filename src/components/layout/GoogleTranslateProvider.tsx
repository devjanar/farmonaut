"use client";
import { useEffect } from "react";

// export default function GoogleTranslateProvider() {
//   useEffect(() => {
//     // Inject Google Translate script
//     if (!document.getElementById("google-translate-script")) {
//       const script = document.createElement("script");
//       script.id = "google-translate-script";
//       script.src =
//         "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//       document.body.appendChild(script);
//     }

//     // Initialize Google Translate
//     (window as any).googleTranslateElementInit = () => {
//       new (window as any).google.translate.TranslateElement(
//         {
//           pageLanguage: "en",
//           autoDisplay: false,
//         },
//         "google_translate_element"
//       );
//     };

//     // Auto-detect browser language and apply
//     const autoTranslate = () => {
//       const userLang = (navigator.language || "en").split("-")[0]; // "bn", "en", etc.
//       const interval = setInterval(() => {
//         const select = document.querySelector<HTMLSelectElement>(
//           ".goog-te-combo"
//         );
//         if (select) {
//           select.value = userLang;
//           select.dispatchEvent(new Event("change"));
//           clearInterval(interval);
//         }
//       }, 1500);
//     };

//     setTimeout(autoTranslate, 2000);
//   }, []);

//   return <div id="google_translate_element" style={{ display: "none" }} />;
// }



// export default function GoogleTranslateProvider() {
//   useEffect(() => {
//     // Inject Google Translate script
//     if (!document.getElementById("google-translate-script")) {
//       const script = document.createElement("script");
//       script.id = "google-translate-script";
//       script.src =
//         "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//       document.body.appendChild(script);
//     }

//     // Initialize Google Translate with only English and Bangla
//     (window as any).googleTranslateElementInit = () => {
//       new (window as any).google.translate.TranslateElement(
//         {
//           pageLanguage: "en",              // Default page language
//           includedLanguages: "en,bn",      // Only English and Bangla
//           autoDisplay: true,
//         },
//         "google_translate_element"
//       );
//     };

//     // Optional: auto-set browser language to Bangla if detected
//     const userLang = (navigator.language || "en").split("-")[0];
//     if (userLang === "bn") {
//       const interval = setInterval(() => {
//         const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
//         if (select) {
//           select.value = "bn";
//           select.dispatchEvent(new Event("change"));
//           clearInterval(interval);
//         }
//       }, 1500);
//     }
//   }, []);


// useEffect(() => {
//   const hideGoogleBar = () => {
//     const iframe = document.querySelector<HTMLIFrameElement>(
//       "iframe.goog-te-banner-frame"
//     );
//     if (iframe) iframe.style.display = "none";

//     const skipTranslate = document.querySelector<HTMLDivElement>(
//       "body > .skiptranslate"
//     );
//     if (skipTranslate) skipTranslate.style.display = "none";
//   };

//   const interval = setInterval(hideGoogleBar, 500);
//   setTimeout(() => clearInterval(interval), 5000); // stop checking after 5s
// }, []); // run once on mount

//   return null;
// }




// export default function GoogleTranslateProvider() {
//   useEffect(() => {
//     // Inject Google Translate script
//     if (!document.getElementById("google-translate-script")) {
//       const script = document.createElement("script");
//       script.id = "google-translate-script";
//       script.src =
//         "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//       document.body.appendChild(script);
//     }

//     // Initialize Google Translate with only English and Bangla
//     (window as any).googleTranslateElementInit = () => {
//       new (window as any).google.translate.TranslateElement(
//         {
//           pageLanguage: "en",
//           includedLanguages: "en,bn",
//           autoDisplay: false, // important to prevent top bar
//         },
//         "google_translate_element"
//       );
//     };

//     // Auto-set language based on browser
//     // const userLang = (navigator.language || "en").split("-")[0]; // "en" or "bn"
//     // const setLanguage = () => {
//     //   const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
//     //   if (select) {
//     //     select.value = userLang === "bn" ? "bn" : "en";
//     //     select.dispatchEvent(new Event("change"));
//     //   }
//     // };
//     // setTimeout(setLanguage, 1500);

//     // Hide Google top bar iframe if it appears
//     // const hideBar = () => {
//     //   const iframe = document.querySelector<HTMLIFrameElement>(
//     //     "iframe.goog-te-banner-frame"
//     //   );
//     //   if (iframe) iframe.style.display = "none";
//     //   const body = document.querySelector("body > .skiptranslate");
//     //   if (body) body.style.display = "none"; // hide extra margin
//     // };
//     // const interval = setInterval(hideBar, 500);
//     // setTimeout(() => clearInterval(interval), 5000); // stop after 5s
//   }, [typeof window !== 'undefined']);

//   return <div id="google_translate_element" style={{ display: "none" }} />;
// }



// export default function GoogleTranslateProvider() {
//   useEffect(() => {
//     // Inject Google Translate script
//     if (!document.getElementById("google-translate-script")) {
//       const script = document.createElement("script");
//       script.id = "google-translate-script";
//       script.src =
//         "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//       document.body.appendChild(script);
//     }

//     // Initialize Google Translate with only English and Bangla
//     (window as any).googleTranslateElementInit = () => {
//       new (window as any).google.translate.TranslateElement(
//         {
//           pageLanguage: "en",
//           includedLanguages: "en,bn",
//          autoDisplay: false, // prevent auto-translation glitches
//         },
//         "google_translate_element"
//       );

//        // Ensure dropdown loads both languages properly
//       const fixDropdown = () => {
//         const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
//         if (select && select.options.length < 2) {
//           // Force re-render if languages not fully loaded
//           setTimeout(fixDropdown, 300);
//         }
//       };
//       fixDropdown();
//     };

//     // Auto-set browser language to Bangla if detected
//     const userLang = (navigator.language || "en").split("-")[0];
//     if (userLang === "bn") {
//       const interval = setInterval(() => {
//         const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
//         if (select) {
//           select.value = "bn";
//           select.dispatchEvent(new Event("change"));
//           clearInterval(interval);
//         }
//       }, 1500);
//     }
//   }, []);

//   // continuously hide Google banner when translation happens
//   useEffect(() => {
//     const hideGoogleBar = () => {
//       const iframe = document.querySelector<HTMLIFrameElement>(
//         "iframe.goog-te-banner-frame"
//       );
//       if (iframe) iframe.style.display = "none";

//       const skipTranslate = document.querySelector<HTMLDivElement>(
//         "body > .skiptranslate"
//       );
//       if (skipTranslate) skipTranslate.style.display = "none";

//       document.body.style.top = "0px"; // sometimes Google adds margin-top
//     };

//     // Run repeatedly and also when translation language changes
//     const observer = new MutationObserver(() => hideGoogleBar());
//     observer.observe(document.body, { childList: true, subtree: true });

//     // initial cleanup loop for safety
//     const interval = setInterval(hideGoogleBar, 500);
//     setTimeout(() => clearInterval(interval), 8000);

//     return () => observer.disconnect();
//   }, []);

//   return null;
// }














export default function GoogleTranslateProvider() {
  useEffect(() => {
    // Inject Google Translate script if not already loaded
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    }

    // Delay init slightly to ensure script fully loads
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "bn",
          includedLanguages: "en,bn",
          autoDisplay: true, // prevent auto-translation glitches
        },
        "google_translate_element"
      );

      // Ensure dropdown loads both languages properly
      const fixDropdown = () => {
        const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
        if (select && select.options.length < 2) {
          // Force re-render if languages not fully loaded
          setTimeout(fixDropdown, 300);
        }
      };
      fixDropdown();
    };

    // Auto-set browser language (after dropdown exists)
    const userLang = (navigator.language || "en").split("-")[0];
    if (userLang === "bn") {
      const interval = setInterval(() => {
        const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
        if (select && select.value !== "bn") {
          select.value = "bn";
          select.dispatchEvent(new Event("change"));
          clearInterval(interval);
        }
      }, 1000);
    }
  }, []);

  // Always hide Google bar
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

    // Observe DOM for language switch events
    const observer = new MutationObserver(hideGoogleBar);
    observer.observe(document.body, { childList: true, subtree: true });

    // Run initial cleanup
    const interval = setInterval(hideGoogleBar, 100);
    setTimeout(() => clearInterval(interval), 8000);

    return () => observer.disconnect();
  }, []);

  return null;
}
