import { useContext } from "react";

import context from "./userContext";

export default function useUser() {
  const userContext = useContext(context);
  const { user, setUser, userDB, setUserDB } = userContext;
  return { user, setUser, userDB, setUserDB };
}
