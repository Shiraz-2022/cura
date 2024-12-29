import { View, Text, Image } from "react-native";
import React from "react";

//components
import CustomButton from "@/components/micro/CustomButton";

//constants
import { imagePaths } from "@/constants/imagePaths";
import { router } from "expo-router";

export default function OnBoarding2() {
  return (
    <View className="h-full w-full bg-white px-10 py-10 items-center">
      <Image source={imagePaths.community} />
      <View>
        <CustomButton
          text="Discover communities"
          bgColor="bg-secondary-light"
          textColor="text-white"
          containerClass="mb-10 mt-10"
          onPress={() => router.push("/community/chat")}
        />
        <CustomButton
          text="Health tracker"
          bgColor="bg-secondary-light"
          textColor="text-white"
          containerClass="mb-10"
          onPress={() => router.push("/healthTracking/(tabs)/tracking")}
        />
      </View>
      <Image source={imagePaths.fitness_tracker} />
    </View>
  );
}
