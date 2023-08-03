"use client";
import { useContext, FormEventHandler, Dispatch, SetStateAction } from "react";
import { RiQrCodeLine } from "react-icons/ri";
import { LinkContext } from "@/contexts/LinkContext";
import { CgSpinner } from "react-icons/cg";

interface ILongLinkInputProps {
  longLink: string;
  setLongLink: Dispatch<SetStateAction<string>>;
  handleLongLinkFormSubmit: FormEventHandler<HTMLFormElement>;
  isStoringLink: boolean;
  isValidLongLink: boolean;
  setIsValidLongLink: Dispatch<SetStateAction<boolean>>;
}

export function LongLinkInput(props: ILongLinkInputProps) {
  const linkContext = useContext(LinkContext);

  const handleCheckBox = () => {
    linkContext?.setCanGenerateQRCode(
      (canGenerateQRCode) => !canGenerateQRCode,
    );
  };

  const canStoreLink = props.longLink.length > 10 ? true : false;

  return (
    <form onSubmit={props.handleLongLinkFormSubmit}>
      <textarea
        onChange={(e) => {
          props.setIsValidLongLink(true);
          props.setLongLink(() => e.target.value);
        }}
        rows={4}
        className={
          props.isValidLongLink
            ? "text-slate-700 w-full mb-1 border text-lg p-2 border-2 rounded focus:outline-slate-500"
            : "text-slate-700 w-full mb-1 border text-lg p-2 border-2 border-red-500 rounded focus:outline-red-500"
        }
        placeholder="Paste long url"
      />

      {!props.isValidLongLink && (
        <div className="max-w-full pl-4">
          <p className="text-left mb-4 text-red-500 opacity-80">
            <span>Invalid Link</span>
            <ul className="list-disc italic">
              <li>
                Link must be start with a valid protocol like HTTP or HTTPS{" "}
              </li>
              <li>Link must be at least 10 chars long</li>
            </ul>
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 mb-8 w-full text-slate-700">
        <input
          checked={linkContext?.canGenerateQRCode}
          onChange={handleCheckBox}
          type="checkbox"
        />
        <div onClick={handleCheckBox} className="flex items-center gap-2 w-fit">
          <span>Generate QR-CODE</span>
          <span>
            <RiQrCodeLine />
          </span>
        </div>
      </div>

      <button
        disabled={!canStoreLink || props.isStoringLink}
        type="submit"
        className="disabled:opacity-75 w-full h-12 text-xl text-white bg-slate-700 px-4 rounded"
      >
        {props.isStoringLink ? (
          <div className="flex items-center justify-center gap-2">
            <CgSpinner className="w-5 h-auto animate-spin" />
            <span>Shorting...</span>
          </div>
        ) : (
          "Short"
        )}
      </button>
    </form>
  );
}
