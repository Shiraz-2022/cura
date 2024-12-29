import React, { createContext, useState, useContext, ReactNode } from "react";

interface Location {
  name: string;
  coordinates: number[];
}

interface LocationContextType {
  location: Location | null;
  setLocation: (location: Location) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

// Create a provider to manage the location state
export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<Location | null>(null);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use location context
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
