import { View, Text, TextInput, InputModeOptions } from "react-native";
import React from "react";

interface CustomInputProps {
  placeholder: string;
  textColor: string;
  placeholderColor: string;
  bgColor: string;
  type: InputModeOptions;
  secure?: boolean;
  containerClass?: string;
  label: string;
  border?: string;
  editable?: boolean;
  onChange?: any;
  value?: string;
}

export default function CustomInput(props: CustomInputProps) {
  const {
    placeholder,
    placeholderColor,
    textColor,
    bgColor,
    type,
    secure,
    containerClass,
    label,
    border,
    editable,
    onChange,
    value,
  } = props;
  return (
    <View className={`${containerClass}`}>
      <Text className="text-neutral-light mb-3 text-sm">{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        className={`${bgColor} ${textColor} ${border} rounded-md py-3 px-5 w-full`}
        inputMode={type}
        secureTextEntry={secure}
        editable={editable}
        onChangeText={(text) => {
          onChange && onChange(text);
        }}
        value={value}
      />
    </View>
  );
}
