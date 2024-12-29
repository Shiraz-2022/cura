import React, { createContext, ReactNode, useContext, useState } from "react";

interface SliderContextProps {
  selected: string;
  setSelected: (value: string) => void;
}

const SliderContext = createContext<SliderContextProps | undefined>(undefined);

export const SliderProvider = ({ children }: { children: ReactNode }) => {
  const [selected, setSelected] = useState<string>("");

  return (
    <SliderContext.Provider value={{ selected, setSelected }}>
      {children}
    </SliderContext.Provider>
  );
};

export const useSliderContext = () => {
  const context = useContext(SliderContext);

  if (!context) {
    throw new Error("useSliderContext must be used within a SliderProvider");
  }

  return context;
};
