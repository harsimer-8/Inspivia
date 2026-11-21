"use client";

import { createContext, useContext } from "react";
import type { SessionUser } from "./types";

/** Provided by the dashboard layout once the session has been verified by the backend. */
const SessionUserContext = createContext<SessionUser | null>(null);

export const SessionUserProvider = SessionUserContext.Provider;

export function useSessionUser(): SessionUser {
  const user = useContext(SessionUserContext);
  if (!user) throw new Error("useSessionUser must be used inside the dashboard layout.");
  return user;
}

export const firstName = (user: SessionUser): string => user.name.split(" ")[0] || user.name;
