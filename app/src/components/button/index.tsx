import React, { useState, useCallback, useEffect } from "react";
import cx from "classnames";

type ButtonProps = {
  canHover: boolean | null;
  cx: string | null;
  onClick: (() => Promise<void>) | (() => void) | null;
};

function Loader() {
  return (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

export function Button({
  cx: classNames,
  canHover = true,
  onClick,
  children,
}: React.PropsWithChildren<ButtonProps>) {
  const [buttonState, setButtonState] = useState({
    loading: false,
    isClickable: false,
  });

  useEffect(() => {
    setButtonState((s) => ({ ...s, isClickable: canHover }));
  }, [setButtonState, canHover]);

  const handleClick = useCallback(async () => {
    if (null === onClick) {
      return;
    }
    setButtonState(() => ({ loading: true, isClickable: false }));
    await onClick();
    setButtonState(() => ({ loading: false, isClickable: canHover }));
  }, [onClick, setButtonState, canHover]);

  return (
    <button
      className={cx(
        `font-inter uppercase rounded-full px-4 py-2 text-sm text-neutal-500 border border-neutral-500 tracking-wide md:px-6 md:py-3 mr-4 ${classNames}`,
        { "hover:bg-opacityLight-5": buttonState.isClickable },
        { "cursor-not-allowed": !buttonState.isClickable }
      )}
      onClick={handleClick}
    >
      {buttonState.loading && <Loader />}
      {children}
    </button>
  );
}
