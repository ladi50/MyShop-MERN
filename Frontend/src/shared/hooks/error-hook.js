import { useCallback } from "react";

export const useError = () => {
  const errorHandler = useCallback((error) => {
    return (
      <div className="form-errors-div">
        {error.map((err, index) => {
          return (
            <p className="form-error-message" key={index}>
              <span className="error-dash">-</span>
              {err}
            </p>
          );
        })}
      </div>
    );
  }, []);

  return { errorHandler };
};
