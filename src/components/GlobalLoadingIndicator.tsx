
import React from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { Progress } from "@/components/ui/progress";

const GlobalLoadingIndicator = () => {
  const { isLoading } = useLoading();
  
  if (!isLoading) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Progress value={100} className="h-1 animate-pulse bg-primary transition-all duration-300" />
    </div>
  );
};

export default GlobalLoadingIndicator;
