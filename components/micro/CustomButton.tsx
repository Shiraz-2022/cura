import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React from "react";

interface CustomButtonProps {
  text: string;
  bgColor: string;
  textColor: string;
  containerClass?: string;
  border?: string;
  onPress?: () => void;
}

export default function CustomButton(props: CustomButtonProps) {
  const { text, bgColor, textColor, containerClass, border, onPress } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${bgColor} ${containerClass} ${border} py-3 w-full rounded-md`}
    >
      <Text className={`text-center ${textColor}`}>{text}</Text>
    </TouchableOpacity>
  );
}
