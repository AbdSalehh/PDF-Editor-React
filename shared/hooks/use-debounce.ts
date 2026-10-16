import { useRef, useCallback, useEffect } from "react";

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const funcRef = useRef(func);

  useEffect(() => {
    funcRef.current = func;
  }, [func]);

  const debouncedCallback = useCallback(
    function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      const context = this;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        funcRef.current.apply(context, args);
        timeoutRef.current = undefined;
      }, delay);
    },
    [delay],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [debouncedCallback]);

  return debouncedCallback;
}
