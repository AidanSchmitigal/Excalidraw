import { Tooltip } from "../../packages/excalidraw/components/Tooltip";
import { warning } from "../../packages/excalidraw/components/icons";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

import "./CollabError.scss";
import { atom } from "jotai";
import { ErrorDialog } from "../../packages/excalidraw/components/ErrorDialog";

type ErrorIndicator = {
  message: string | null;
  /** used to rerun the useEffect responsible for animation */
  nonce: number;
};

export const collabErrorIndicatorAtom = atom<ErrorIndicator>({
  message: null,
  nonce: 0,
});

const CollabError = ({ collabError }: { collabError: ErrorIndicator }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const clearAnimationRef = useRef<string | number | NodeJS.Timeout>();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    clearAnimationRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 1000);

    return () => {
      clearTimeout(clearAnimationRef.current);
    };
  }, [collabError.message, collabError.nonce]);

  if (!collabError.message) {
    return null;
  }

  return (
    <>
      <Tooltip label={collabError.message} long={true}>
        <button
          className={clsx("collab-errors-button", {
            "collab-errors-button-shake": isAnimating,
          })}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {warning}
        </button>
      </Tooltip>
      {isOpen && (
        <ErrorDialog onClose={() => setIsOpen(false)}>
          {collabError.message}
        </ErrorDialog>
      )}
    </>
  );
};

CollabError.displayName = "CollabError";

export default CollabError;
