import { FormEvent, useContext, useState } from "react";
import { RiQrCodeLine } from "react-icons/ri";
import { LinkContext } from "@/contexts/LinkContext";
import { hashLongLink } from "@/lib/hashLongLink";

/*
 * TODO:
 *     ::
 *
 *
 */

export function LongURLInput() {
  const linkContext = useContext(LinkContext);
  const [isValidURL, setIsValidURL] = useState(true);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!linkContext?.longLink.toLowerCase().startsWith("http")) {
      setIsValidURL(false);
      return;
    }

    if (!linkContext?.longLink) return;
    const newShortURL = hashLongLink(linkContext.longLink);
    linkContext?.setShortLink(window.location.href + newShortURL);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <textarea
        onInput={(e) => {
          setIsValidURL(true)
          const target = e.target as HTMLInputElement;
          linkContext?.setLongLink(target.value);
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
          checked={linkContext?.canGenerateQRCode}
          onChange={() =>
            linkContext?.setCanGenerateQRCode(
              (canGenerateQRCode) => !canGenerateQRCode
            )
          }
          type="checkbox"
        />
        <div
          onClick={() =>
            linkContext?.setCanGenerateQRCode(
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
          linkContext?.longLink && linkContext.longLink.length > 0
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
