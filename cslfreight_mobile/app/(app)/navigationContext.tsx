import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
    navigationStack: string[];
    pushToStack: (route: string) => void;
    popFromStack: () => string | null;
    clearStack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
    const [navigationStack, setNavigationStack] = useState<string[]>([]);

    const pushToStack = (route: string) => {
        setNavigationStack(prev => {
            // Only add if not already at the top of the stack (prevent duplicates)
            if (prev[prev.length - 1] !== route) {
                return [...prev, route];
            }
            return prev;
        });
    };

    const popFromStack = () => {
        let poppedRoute: string | null = null;
        setNavigationStack(prev => {
            if (prev.length > 0) {
                poppedRoute = prev[prev.length - 1];
                return prev.slice(0, -1);
            }
            return prev;
        });
        return poppedRoute;
    };

    const clearStack = () => {
        setNavigationStack([]);
    };

    return (
        <NavigationContext.Provider value={{ navigationStack, pushToStack, popFromStack, clearStack }}>
            {children}
        </NavigationContext.Provider>
    );
}

/**
 * Hook to access navigation stack context
 * Returns the context if available, or a no-op implementation if not
 * This allows the hook to be used safely outside of NavigationProvider
 */
export function useNavigationStack(): NavigationContextType {
    const context = useContext(NavigationContext);
    
    // If context is not available, return a no-op implementation
    if (!context) {
        return {
            navigationStack: [],
            pushToStack: () => {},
            popFromStack: () => null,
            clearStack: () => {},
        };
    }
    
    return context;
}
