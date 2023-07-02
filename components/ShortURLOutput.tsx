import { QRCodeContext } from "@/contexts/QRCodeContext";
import { useRef, useState, useEffect, useContext } from "react";
import QRCode from "react-qr-code";
import { IoIosCopy } from "react-icons/io";
import { IoMdDownload } from "react-icons/io";

export function ShortURLOutput() {
  const qrCodeContext = useContext(QRCodeContext);

  const [isURLCopied, setIsURLCopied] = useState(false);
  const QRCodeWrapRef = useRef<HTMLDivElement>(null);

  const downloadQRCodeAsPNG = () => {
    if (!QRCodeWrapRef.current) {
      return;
    }

    const svg = QRCodeWrapRef.current.querySelector("svg");
    if (!svg) return;

    const svgBounds = svg.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;
    canvas.width = svgBounds.height;
    canvas.height = svgBounds.height;

    const svgString = new XMLSerializer().serializeToString(svg);

    const image = new Image();

    image.onload = () => {
      context.drawImage(image, 0, 0);
      const dataURL = canvas.toDataURL();
      const imageDownloadURL = document.createElement("a");
      imageDownloadURL.href = dataURL;
      imageDownloadURL.download = "qrcode.png";
      imageDownloadURL.click();
    };

    image.src =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
  };

  const copyToClipBoard = () => {
    qrCodeContext?.shortURL &&
      navigator.clipboard.writeText(qrCodeContext?.shortURL);
    setIsURLCopied(true);
  };

  useEffect(() => {
    (async () => {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText === qrCodeContext?.shortURL) {
        setIsURLCopied(true);
      } else {
        setIsURLCopied(false);
      }
    })();
  }, [qrCodeContext?.shortURL]);

  return (
    <div className="mt-8">
      <div className="shadow p-2 rounded flex justify-between items-center">
        <span className="">{qrCodeContext?.shortURL}</span>
        <span className="text-sky-500">
          {isURLCopied ? (
            "copied"
          ) : (
            <IoIosCopy onClick={() => copyToClipBoard()} />
          )}
        </span>
      </div>
      {qrCodeContext?.canGenerateQRCode && (
        <div
          ref={QRCodeWrapRef}
          className="relative flex justify-center mt-4 shadow border p-2 rounded"
        >
          <QRCode
            value={qrCodeContext?.shortURL || ""}
            onClick={downloadQRCodeAsPNG}
          />
          <div className="absolute top-0 right-0 rounded-tr p-1 bg-sky-500">
          <IoMdDownload onClick={downloadQRCodeAsPNG} role="Download QR Code as PNG image" className="text-white w-5 h-5" />
          </div>
        </div>
      )}
    </div>
  );
}
