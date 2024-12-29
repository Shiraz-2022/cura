import { View, Image } from "react-native";
import React from "react";

interface ImageBoxProps {
  height: number;
  width: number;
  image?: number;
  uri?: boolean;
  imageUri?: string;
}

export default function ImageBox(props: ImageBoxProps) {
  const { height, width, image, uri, imageUri } = props;

  return (
    <View
      className={`p-0.5 border border-lightBrown rounded-lg`}
      style={{ height: height, width: width }}
    >
      <Image
        source={uri ? { uri: imageUri } : image}
        className={`rounded-lg w-full h-full`}
        style={{ resizeMode: "cover" }}
      />
    </View>
  );
}
