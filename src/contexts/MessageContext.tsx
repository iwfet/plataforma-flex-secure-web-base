
import React, { createContext, useContext, useRef } from "react";
import { toast, Toaster } from "sonner";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

type MessageType = "success" | "error" | "info" | "warning";

interface Message {
  type: MessageType;
  text: string;
  duration?: number;
}

interface MessageContextType {
  showMessage: (message: Message) => void;
  showSuccess: (text: string, duration?: number) => void;
  showError: (text: string, duration?: number) => void;
  showInfo: (text: string, duration?: number) => void;
  showWarning: (text: string, duration?: number) => void;
}

const MessageContext = createContext<MessageContextType>({} as MessageContextType);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Track recently shown messages to prevent duplicates
  const recentMessages = useRef<Map<string, number>>(new Map());

  // Improved duplicate message prevention - longer window (5 seconds)
  const isDuplicateMessage = (key: string): boolean => {
    const now = Date.now();
    const lastShown = recentMessages.current.get(key);

    if (lastShown && now - lastShown < 5000) {
      return true;
    }

    // Store this message as recently shown
    recentMessages.current.set(key, now);

    // Clean up old messages (older than 10 seconds)
    for (const [msgKey, timestamp] of recentMessages.current.entries()) {
      if (now - timestamp > 10000) {
        recentMessages.current.delete(msgKey);
      }
    }

    return false;
  };

  const showMessage = ({ type, text, duration = 5000 }: Message) => {
    // Create a unique key for this message type+text
    const messageKey = `${type}:${text}`;

    // Skip if this is a duplicate message shown too quickly
    if (isDuplicateMessage(messageKey)) {
      return;
    }


    // Create a styled div for the toast content with icon
    const content = (
      <div className="flex items-start gap-2">
        {type === "success" && <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />}
        {type === "error" && <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />}
        {type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />}
        {type === "info" && <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />}
        <span className="text-sm">{text}</span>
      </div>
    );

    switch (type) {
      case "success":
        toast.success(content, { duration, id: messageKey });
        break;
      case "error":
        toast.error(content, { duration, id: messageKey });
        break;
      case "info":
        toast.info(content, { duration, id: messageKey });
        break;
      case "warning":
        toast.warning(content, { duration, id: messageKey });
        break;
      default:
        toast(content, { duration, id: messageKey });
    }
  };

  const showSuccess = (text: string, duration?: number) => {
    showMessage({ type: "success", text, duration });
  };

  const showError = (text: string, duration?: number) => {
    showMessage({ type: "error", text, duration });
  };

  const showInfo = (text: string, duration?: number) => {
    showMessage({ type: "info", text, duration });
  };

  const showWarning = (text: string, duration?: number) => {
    showMessage({ type: "warning", text, duration });
  };

  return (
    <MessageContext.Provider
      value={{ showMessage, showSuccess, showError, showInfo, showWarning }}
    >
      <Toaster
        position="top-right"
        expand={true}
        visibleToasts={5}
        closeButton={true}
        richColors={true}
        toastOptions={{
          style: {
            margin: '8px 0',
          }
        }}
      />
      {children}
    </MessageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMessage = () => useContext(MessageContext);
