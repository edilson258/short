import { FormEvent, useContext } from "react";
import { RiQrCodeLine } from "react-icons/ri";
import { QRCodeContext } from "@/contexts/QRCodeContext";
import { makeURLShort } from "@/utils/makeURLShort";

export function LongURLInput() {
  const qrCodeContext = useContext(QRCodeContext);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!qrCodeContext?.longURL) return;
    const newShortURL = makeURLShort(qrCodeContext.longURL);
    qrCodeContext?.setShortURL(window.location.href + newShortURL);
  };

  return (
    <form onSubmit={(e) => handleFormSubmit(e)}>
      <textarea
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          qrCodeContext?.setLongURL(target.value);
        }}
        rows={4}
        className="w-full mb-4 border text-xl indent-1 border-2 w-3/4 rounded focus:outline-none"
        placeholder="Paste long url"
      />

      <div className="flex items-center gap-2 mb-4 w-fit">
        <input
          checked={qrCodeContext?.canGenerateQRCode}
          onChange={() =>
            qrCodeContext?.setCanGenerateQRCode(
              (canGenerateQRCode) => !canGenerateQRCode
            )
          }
          type="checkbox"
        />
        <div
          onClick={() =>
            qrCodeContext?.setCanGenerateQRCode(
              (canGenerateQRCode) => !canGenerateQRCode
            )
          }
          className="flex items-center gap-2 w-fit"
        >
          <span>Generate QRCODE</span>
          <span className="text-sky-500">
            <RiQrCodeLine />
          </span>
        </div>
      </div>

      <button
        disabled={
          qrCodeContext?.longURL && qrCodeContext?.longURL.length > 0
            ? false
            : true
        }
        type="submit"
        className="disabled:opacity-75 w-full h-12 text-xl text-white bg-sky-500 px-4 rounded"
      >
        Short
      </button>
    </form>
  );
}
