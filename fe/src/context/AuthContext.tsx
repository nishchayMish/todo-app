import React, { createContext, useState } from 'react'
import Cookies from "js-cookie";

interface AuthContextType {
    user: User | null,
    setUser: React.Dispatch<React.SetStateAction<User | null >>
}

export type User = {
    id: string,
    username: string,
    email: string,
    user_image?: string | null
};

const getStoredUser = (): User | null => {
  const token = Cookies.get("token");
  if (!token) return null;

  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

const AuthContextProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(getStoredUser);
  return (
    <AuthContext.Provider value={{user, setUser}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider