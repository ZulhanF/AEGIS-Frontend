/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext({
  user: null,
  setUser: () => {},
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const value = {
    user,
    setUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
