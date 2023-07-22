"use client"
import { useState } from "react";
import { FcCollapse, FcExpand } from "react-icons/fc";
import { LuEye, LuClipboardCopy, LuShare2, LuTrash, LuActivity } from "react-icons/lu";

interface IExpandableProps {
  mainInfo: string;
  extraInfo: string;
}

export function ExpandableContent({ mainInfo, extraInfo }: IExpandableProps) {
  const [showExtraInfo, setShowExtraInfo] = useState(false);

  return (
    <div className="mb-4 text-left shadow rounded w-full mx-auto p-2">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-md">{mainInfo}</h1>
        <button
          className="p-2"
          onClick={() => setShowExtraInfo((showExtraInfo) => !showExtraInfo)}
        >
          {showExtraInfo ? <FcCollapse /> : <FcExpand />}
        </button>
      </div>
      {showExtraInfo && (
        <div>
          <p className="break-words">{extraInfo}</p>
          <div className="my-4 border-t border-slate-200 border-1 w-full" />
          <div className="text-lg mt-3 flex items-center justify-end gap-2">
            <span className="rounded-full p-2 hover:bg-slate-700 hover:text-white">
              <LuEye />
            </span>
            <span className="rounded-full p-2 hover:bg-slate-700 hover:text-white">
              <LuClipboardCopy />
            </span>
            <span className="rounded-full p-2 hover:bg-slate-700 hover:text-white">
              <LuActivity />
            </span>
            <span className="rounded-full p-2 hover:bg-slate-700 hover:text-white">
              <LuShare2 />
            </span>
            <span className="rounded-full p-2 text-red-500 hover:bg-red-500 hover:text-white">
              <LuTrash />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
