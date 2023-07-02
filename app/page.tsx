"use client";
import { useState } from "react";
import { QRCodeContext } from "@/contexts/QRCodeContext";
import { LongURLInput } from "@/components/LongURLInput";
import { ShortURLOutput } from "@/components/ShortURLOutput";

export default function Home() {
  const [shortURL, setShortURL] = useState<string | null>(null);
  const [longURL, setLongURL] = useState<string>("");
  const [canGenerateQRCode, setCanGenerateQRCode] = useState(false);

  return (
    <QRCodeContext.Provider
      value={{
        shortURL,
        setShortURL,
        longURL,
        setLongURL,
        canGenerateQRCode,
        setCanGenerateQRCode,
      }}
    >
      <main className="text-center max-w-screen-sm container mx-auto mt-12 py-8 px-4">
        <h1 className="mb-8 text-3xl font-bold text-sky-500">URL Shorter</h1>
        <LongURLInput />
        {shortURL && <ShortURLOutput />}
      </main>
    </QRCodeContext.Provider>
  );
}
