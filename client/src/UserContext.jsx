import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:4000';

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user) {
                try {
                    const { data } = await axios.get('/profile');
                    setUser(data);
                    setError(null);
                } catch (err) {
                    console.error('Failed to fetch user profile:', err.message);
                    setError(err.message);
                    
                    // Handle different error types
                    if (err.code === 'ERR_NETWORK' || err.code === 'ERR_CONNECTION_REFUSED') {
                        console.error('Backend server is not running or not accessible at http://localhost:4000');
                    } else if (err.response?.status === 401) {
                        console.error('User not authenticated');
                    }
                } finally {
                    setReady(true);
                }
            }
        };

        fetchUserProfile();
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, ready, error }}>
            {children}
        </UserContext.Provider>
    );
}