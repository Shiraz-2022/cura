import { View, Text, Pressable } from "react-native";
import React from "react";
import { useSliderContext } from "@/contexts/SliderSwitchContext";

interface SliderSwitchProps {
  left: string;
  right: string;
}

export default function SliderSwitch(props: SliderSwitchProps) {
  const { left, right } = props;
  const { selected, setSelected } = useSliderContext();

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  return (
    <View className="flex-row justify-between w-full rounded-full bg-neutral-light">
      <Pressable
        className={`rounded-full px-5 py-3 w-1/2 ${
          selected === left ? "bg-secondary-light" : "bg-transparent"
        }`}
        onPress={() => handleSelect(left)}
      >
        <Text
          className={`text-center font-bold ${
            selected === left ? "text-neutral-light" : "text-primary-dark"
          }`}
        >
          {left}
        </Text>
      </Pressable>
      <Pressable
        className={`rounded-full px-5 py-3 w-1/2 ${
          selected === right ? "bg-secondary-light" : "bg-transparent"
        }`}
        onPress={() => handleSelect(right)}
      >
        <Text
          className={`text-center font-bold ${
            selected === right ? "text-neutral-light" : "text-primary-dark"
          }`}
        >
          {right}
        </Text>
      </Pressable>
    </View>
  );
}
