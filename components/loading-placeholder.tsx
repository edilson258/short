import LoadingPlaceholder from "react-placeholder-loading";

interface ILoadingPlaceholder {
  widthInPixels?: number,
  heightInPixels: number
}

export function CustomLoadingPlaceholder({ widthInPixels, heightInPixels }: ILoadingPlaceholder) {
  return (
    <div className="shadow w-full md:mt-0 rounded overflow-hidden">
      <LoadingPlaceholder
        colorStart="white"
        colorEnd="#f1f5f9"
        width={widthInPixels || "100%"}
        height={`${heightInPixels}px`}
        shape="rect"
      />
    </div>
  );
}
