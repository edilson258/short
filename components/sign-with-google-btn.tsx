import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FcGoogle } from "react-icons/fc";

interface ISignInWithGoogleButtonProps {
  handleSignInWithGoogle: () => void;
}

export function SignInWithGoogleButton(props: ISignInWithGoogleButtonProps) {
  const [isGooglePageLoading, setIsGooglePageLoading] = useState(false);
  return (
    <div className="mt-8 shadow">
      <button
        disabled={isGooglePageLoading}
        onClick={() => {
          setIsGooglePageLoading(() => true);
          props.handleSignInWithGoogle();
        }}
        type="button"
        className="shadow text-md w-full font-bold p-2 border border-slate-700 rounded"
      >
        <div className="flex items-center justify-center gap-2">
          {isGooglePageLoading ? (
            <CgSpinner className="w-5 h-auto animate-spin" />
          ) : (
            <FcGoogle className="text-lg" />
          )}
          <span>Google</span>
        </div>
      </button>
    </div>
  );
}
