import { View, Text, Image } from "react-native";
import React from "react";
import { ImageSourcePropType } from "react-native";

interface StatBoxProps {
  icon: ImageSourcePropType | undefined;
  heading: string;
  value: string;
  unit: string;
  bgColor: string;
  iconBgColor: string;
  textColor: string;
  unitColor: string;
}

export default function StatBox(props: StatBoxProps) {
  const {
    icon,
    heading,
    value,
    unit,
    bgColor,
    iconBgColor,
    textColor,
    unitColor,
  } = props;
  return (
    <View className={`w-full ${bgColor} rounded-lg p-3`}>
      <View className="flex-row items-center gap-2 mb-3">
        <View className={`${iconBgColor} rounded-full p-2`}>
          <Image source={icon} />
        </View>
        <Text className={`${textColor} font-bold`}>{heading}</Text>
      </View>
      <View className="flex-row justify-between items-center">
        <Text className={`${textColor} text-2xl font-light`}>{value}</Text>
        <Text className={`${unitColor} text-xs`}>{unit}</Text>
      </View>
    </View>
  );
}
