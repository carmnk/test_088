import { useState, useCallback, useRef } from "react";

export type UseElementHoverParams = {
  disabled?: boolean;
};

export const useElementHover = (params: UseElementHoverParams) => {
  const { disabled } = params ?? {};
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = useCallback((e: any) => {
    e.stopPropagation();
    setIsHovering(true);
  }, []);
  const handleMouseOut = useCallback((e: any) => {
    e.stopPropagation();
    setIsHovering(false);
  }, []);

  const nodeRef = useRef<HTMLElement>();

  const callbackRef = useCallback(
    (node: any) => {
      if (disabled) return;
      if (nodeRef.current) {
        nodeRef.current.removeEventListener("mouseover", handleMouseOver);
        nodeRef.current.removeEventListener("mouseout", handleMouseOut);
      }

      nodeRef.current = node;

      if (nodeRef.current) {
        nodeRef.current.addEventListener("mouseover", handleMouseOver);
        nodeRef.current.addEventListener("mouseout", handleMouseOut);
      }
    },
    [handleMouseOver, handleMouseOut, disabled]
  );

  return { callbackRef, isHovering };
};
