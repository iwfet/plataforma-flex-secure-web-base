
import {useState} from "react";
import { User } from "@/types";

/**
 * Hook to manage auth state
 */
export const useAuthState = () => {
    const [user, setUserState] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    return {
        user,
        setUserState,
        isLoading,
        setIsLoading
    };
};
