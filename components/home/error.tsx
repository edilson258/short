import { TError } from "./types";

export function ShowError({ errorTitle, errorMessage }: TError) {
  return (
    <div className="w-full text-center text-red-600 mt-8 rounded shadow p-2">
      <p className="mb-2">{errorTitle}</p>
      <p className="text-xs">{errorMessage}</p>
    </div>
  );
}
