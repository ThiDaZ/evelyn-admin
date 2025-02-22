"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function HtmlPage() {
  const [htmlContent, setHtmlContent] = useState("");
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light"); // Force light theme

    fetch("/policy.html")
      .then((response) => response.text())
      .then((data) => setHtmlContent(data));

    return () => setTheme("system"); // Restore previous theme when leaving
  }, [setTheme]);


  useEffect(() => {
    fetch("/policy.html")
      .then((response) => response.text())
      .then((data) => setHtmlContent(data));
  }, []);

  return (
    <div className="p-8">
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />

    </div>
  );
}
