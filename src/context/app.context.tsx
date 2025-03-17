import React, { createContext, useContext } from "react";
import { useState } from "react";

interface IAppContext {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  setUser: (v: IUser) => void;
  user: IUser | null;
}
const CurrentAppContext = createContext<IAppContext | null>(null);

type IProps = {
  children: React.ReactNode;
};

export const AppProvider = (props: IProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);

  return (
    <CurrentAppContext.Provider
      value={{ isAuthenticated, user, setIsAuthenticated, setUser }}
    >
      {props.children}
    </CurrentAppContext.Provider>
  );
};

export const useCurrentApp = () => {
  ///////////// custom hook => useContext
  const currentAppContext = useContext(CurrentAppContext);

  if (!currentAppContext) {
    throw new Error(
      "useCurrentApp has to be used within <CurrentUserContext.Provider>"
    );
  }

  return currentAppContext;
};
