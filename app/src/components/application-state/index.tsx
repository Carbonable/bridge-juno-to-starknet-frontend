import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useApplicationState, State } from "~/src/hook/useApplicationState";
import { Button } from "~/src/components/button";

function ApplicationStatePopup() {
  const { state, hideMessage } = useApplicationState();
  return (
    <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="w-1/2 border border-neutral-500 rounded-md px-8 py-4 bg-neutral-800">
        <div className="flex justify-between items-center">
          <h3 className="font-inter font-bold text-neutral-100 text-lg uppercase">
            {state.title}
          </h3>{" "}
          <Button cx="px-2" onClick={hideMessage}>
            x
          </Button>
        </div>
        <div
          className="my-8"
          dangerouslySetInnerHTML={{ __html: state.message }}
        ></div>
        <div className="border-t border-neutral-500 pt-4">
          <Button onClick={hideMessage}>Close</Button>
        </div>
      </div>
    </div>
  );
}

export function ApplicationState() {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const { state } = useApplicationState();

  useEffect(() => {
    const el = document.getElementById("app-messages");
    if (null !== el) {
      setElement(el);
    }
  }, [element, setElement]);

  if (null === element) {
    return null;
  }
  if (state.state === State.Hidden) {
    return null;
  }

  return ReactDOM.createPortal(<ApplicationStatePopup />, element);
}
