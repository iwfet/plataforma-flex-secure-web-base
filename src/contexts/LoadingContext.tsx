
import React, { createContext, useContext, useState, useCallback } from "react";

interface LoadingContextType {
  isLoading: boolean;
  onLoadingStart: () => void;
  onLoadingEnd: () => void;
}

const LoadingContext = createContext<LoadingContextType>({} as LoadingContextType);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);

  const onLoadingStart = useCallback(() => {
    setLoadingCount(prev => prev + 1);
  }, []);

  const onLoadingEnd = useCallback(() => {
    setLoadingCount(prev => Math.max(0, prev - 1));
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        isLoading: loadingCount > 0,
        onLoadingStart,
        onLoadingEnd
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
