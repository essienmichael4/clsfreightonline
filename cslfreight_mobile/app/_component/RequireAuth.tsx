import React from "react";
import useAuth from "app/_hooks/useAuth";
import { usePathname, useRouter } from "expo-router";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
    const { auth, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    React.useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (!loading && !auth && pathname !== "/login") {
            // Small delay to ensure React has finished rendering
            timeoutId = setTimeout(() => {
                router.replace("/login");
            }, 0);
        }

        // Cleanup: cancel navigation if component unmounts
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [auth, loading, pathname, router]);

    if (loading) return null;

    if (!auth) return null;

    return <>{children}</>;
}
