import API_PATH from "../api";

import { useAuth } from "../auth/useLogin";

function useFetch() {
    const { token, setIsUserAllowed, signOut } = useAuth();

    function myFetch(route: string, method?: string, body?: any) {
        return fetch(`${API_PATH}/${route}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...(body && { "Content-Type": "application/json" })
            },
            method,
            body: body ? JSON.stringify(body) : undefined,
        })
        .then(res => {
            if (res.status === 401) {
                signOut();
                throw new Error("Logged out");
            } else if (res.status === 403) {
                setIsUserAllowed(false);
                throw new Error("You are not authorized to access this resource");
            } else if (!res.ok) {
                throw new Error("Server error: something went wrong");
            }
            return res;
        })
        .then(res => res.json())
    }
    
    return myFetch;
}

export default useFetch;