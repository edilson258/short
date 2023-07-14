import { FormEvent, useContext, useState } from "react";
import { RiQrCodeLine } from "react-icons/ri";
import { URLContext } from "@/contexts/URLContext";
import { makeURLShort } from "@/utils/makeURLShort";

/*
 * TODO:
 *     ::
 *
 *
 */

export function LongURLInput() {
  const urlContext = useContext(URLContext);
  const [isValidURL, setIsValidURL] = useState(true);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!urlContext?.longURL.toLowerCase().startsWith("http")) {
      setIsValidURL(false);
      return;
    }

    if (!urlContext?.longURL) return;
    const newShortURL = makeURLShort(urlContext.longURL);
    urlContext?.setShortURL(window.location.href + newShortURL);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <textarea
        onInput={(e) => {
          setIsValidURL(true)
          const target = e.target as HTMLInputElement;
          urlContext?.setLongURL(target.value);
        }}
        rows={4}
        className={
          isValidURL
            ? "text-slate-700 w-full mb-1 border text-lg indent-1 border-2 rounded focus:outline-slate-500"
            : "text-slate-700 w-full mb-1 border text-lg indent-1 border-2 border-red-500 rounded focus:outline-red-500"
        }
        placeholder="Paste long url"
      />

      {!isValidURL && (
        <p className="italic text-left mb-4 text-red-500 opacity-80">
          <span className="font-bold">NOTE</span>: url should start with
          <span className="underline underline-offset-2 font-bold text-sky-500"> http</span> or
          <span className="underline underline-offset-2 font-bold text-sky-500"> https</span>
        </p>
      )}

      <div className="flex items-center gap-2 mb-8 w-fit text-slate-700">
        <input
          checked={urlContext?.canGenerateQRCode}
          onChange={() =>
            urlContext?.setCanGenerateQRCode(
              (canGenerateQRCode) => !canGenerateQRCode
            )
          }
          type="checkbox"
        />
        <div
          onClick={() =>
            urlContext?.setCanGenerateQRCode(
              (canGenerateQRCode) => !canGenerateQRCode
            )
          }
          className="flex items-center gap-2 w-fit"
        >
          <span>Generate QR-CODE</span>
          <span>
            <RiQrCodeLine />
          </span>
        </div>
      </div>

      <button
        disabled={
          urlContext?.longURL && urlContext.longURL.length > 0
            ? false
            : true
        }
        type="submit"
        className="disabled:opacity-75 w-full h-12 text-xl text-white bg-slate-700 px-4 rounded"
      >
        Short
      </button>
    </form>
  );
}
