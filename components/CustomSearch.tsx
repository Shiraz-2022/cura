import { View, Image, TextInput, Pressable } from "react-native";
import React, { useState } from "react";

//constants
import { imagePaths } from "@/constants/imagePaths";

interface CustomSearchProps {
  placeholder: string;
  onChange?: (text: string) => void; // Function to handle text change
  onPress?: (text: string) => void; // Function to handle search button press
}

export default function CustomSearch(props: CustomSearchProps) {
  const { placeholder, onChange, onPress } = props;
  const [text, setText] = useState<string>("");

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (onChange) {
      onChange(newText); // Propagate text changes
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress(text); // Pass the current text value when the button is pressed
    }
  };

  return (
    <View className="bg-neutral-light rounded-full py-1 px-5 flex-row items-center">
      <Pressable onPress={handlePress}>
        <Image source={imagePaths.search_icon} className="w-5 h-5 mr-5" />
      </Pressable>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#778DA9"
        className="text-sm rounded-full w-3/4 text-primary-dark"
        value={text}
        onChangeText={handleTextChange} // Correct method to handle text changes
      />
    </View>
  );
}
