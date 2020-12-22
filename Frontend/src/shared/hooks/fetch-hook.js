import { useCallback, useEffect, useState, useMemo } from "react";

export const useFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const controller = useMemo(() => new AbortController(), []);
  const { signal } = controller;

  const scrollPageHandler = () => {
    window.scrollTo({ top: 40, behavior: "smooth" });
  };

  const fetchHandler = useCallback(
    async (url, args) => {
      setIsLoading(true);

      try {
        const response = await fetch(url, { ...args, signal });

        const resData = await response.json();

        if (!response.ok) {
          scrollPageHandler();
          throw new Error(resData.message.split(","));
        }

        setIsLoading(false);
        return resData;
      } catch (err) {
        setIsLoading(false);
        setError(
          err.message.split(",") || "Something went wrong! Please try again."
        );
        scrollPageHandler();
      }
    },
    [signal]
  );

  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, [controller]);

  return { fetchHandler, error, isLoading };
};
