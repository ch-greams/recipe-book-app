import { useEffect } from "react";
import { useRouter } from "next/router";


export function useLoginRedirect(isLoggedIn: boolean): void {
    const router = useRouter();
    useEffect(() => {
        if (!isLoggedIn) {
            router.push(`/login?redirect=${router.asPath}`);
        }
    }, [ isLoggedIn ]);
}
