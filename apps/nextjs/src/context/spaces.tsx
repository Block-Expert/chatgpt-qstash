/* eslint-disable @typescript-eslint/no-unsafe-return */

import { createContext, useContext, useEffect, useState } from "react";
import { Space } from "@wove/db";

import { getLocalStorage, setLocalStorage } from "~/utils/helpers/localStorage";

/*
 * This is a custom context that is used to share data between components used in the Onboarding.
 */

/*
 * Curriculum store
 */

export type SpacesContent = {
  spaces: Space[];
  setSpaces: (spaces: Space[]) => void;
};

const SpacesContext = createContext<SpacesContent>({
  spaces: [],
  setSpaces: () => undefined,
});

export function SpacesWrapper({ children }: { children: React.ReactNode }) {
  const [spaces, setSpaces] = useState<Space[]>([]);

  const sharedState: SpacesContent = {
    spaces,
    setSpaces,
  };
  return (
    <SpacesContext.Provider value={sharedState}>
      {children}
    </SpacesContext.Provider>
  );
}

export function useSpaces() {
  return useContext(SpacesContext);
}
