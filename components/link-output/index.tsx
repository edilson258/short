import { LinkContext } from "@/contexts/LinkContext";
import { useRef, useState, useContext } from "react";
import QRCode from "react-qr-code";
import { IoIosCopy } from "react-icons/io";
import { IoMdDownload } from "react-icons/io";

export function ShortLinkOutput() {
  const urlContext = useContext(LinkContext);

  const getShortLink = () => {
    return window.location.origin + "/" + urlContext?.shortLink
  }

  const [isLinkCopied, setIsLinkCopied] = useState(false);
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
      const dataLink = canvas.toDataURL();
      const imageDownloadLink = document.createElement("a");
      imageDownloadLink.href = dataLink;
      imageDownloadLink.download = "qrcode.png";
      imageDownloadLink.click();
    };

    image.src =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
  };

  const copyToClipBoard = () => {
    urlContext?.shortLink &&
      navigator.clipboard.writeText(getShortLink());
    setIsLinkCopied(true);

    // Tell the user that Link was copied and after for 3 seconds
    setTimeout(() => {
      setIsLinkCopied(false)
    }, 3000)
  };


  return (
    <div className="mt-8 md:mt-0">
      <div className="text-slate-700 shadow p-2 rounded flex justify-between items-center">
        <span>{getShortLink()}</span>
        <span>
          {isLinkCopied ? (
            "copied"
          ) : (
            <IoIosCopy onClick={() => copyToClipBoard()} />
          )}
        </span>
      </div>
      {urlContext?.canGenerateQRCode && (
        <div
          ref={QRCodeWrapRef}
          className="relative flex justify-center mt-4 shadow border p-2 rounded"
        >
          <QRCode
            bgColor="#000000"
            fgColor="#FFFFFF"
            value={getShortLink()}
            onClick={downloadQRCodeAsPNG}
          />
          <div className="absolute shadow-lg top-0 right-0 rounded-tr p-1 bg-slate-700">
          <IoMdDownload onClick={downloadQRCodeAsPNG} role="Download QR Code as PNG image" className="text-white w-5 h-5" />
          </div>
        </div>
      )}
    </div>
  );
}
