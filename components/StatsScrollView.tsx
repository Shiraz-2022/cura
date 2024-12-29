import { View, Text } from "react-native";
import React from "react";

//constants
import { imagePaths } from "@/constants/imagePaths";

//components
import StatBox from "./StatBox";

export default function StatsScrollView() {
  return (
    <View>
      <View className="mt-7">
        <View className="flex-row mb-7 justify-between">
          <View className="w-[47%]">
            <StatBox
              icon={imagePaths.fat_icon}
              bgColor="bg-neutral-light"
              textColor="text-neutral-dark"
              heading="Fat"
              unit="fat"
              value="345"
              iconBgColor="bg-secondary-green"
              unitColor="text-neutral-default"
            />
          </View>
          <View className="w-[47%]">
            <StatBox
              icon={imagePaths.carbs_icon}
              bgColor="bg-neutral-light"
              textColor="text-neutral-dark"
              heading="Carbs"
              unit="carbs"
              value="56"
              iconBgColor="bg-secondary-blue"
              unitColor="text-neutral-default"
            />
          </View>
        </View>
        <View className="flex-row justify-between">
          <View className="w-[47%]">
            <StatBox
              icon={imagePaths.protein_icon}
              bgColor="bg-neutral-light"
              textColor="text-neutral-dark"
              heading="Protein"
              unit="Protein"
              value="45"
              iconBgColor="bg-secondary-purple"
              unitColor="text-neutral-default"
            />
          </View>
          <View className="w-[47%]">
            <StatBox
              icon={imagePaths.calories_icon}
              bgColor="bg-neutral-light"
              textColor="text-neutral-dark"
              heading="Calories"
              unit="KCal"
              value="345"
              iconBgColor="bg-secondary-brown"
              unitColor="text-neutral-default"
            />
          </View>
        </View>
      </View>
      <Text className="text-neutral-light text-xl my-5">Daily overview</Text>
      <View className="mt-5">
        <View className="flex-row mb-7 justify-between">
          <View className="w-[47%]">
            <StatBox
              icon={imagePaths.fat_icon}
              bgColor="bg-neutral-light"
              textColor="text-neutral-dark"
              heading="Fat"
              unit="fat"
              value="345"
              iconBgColor="bg-secondary-green"
              unitColor="text-neutral-default"
            />
          </View>
          <View className="w-[47%]">
            <StatBox
              icon={imagePaths.carbs_icon}
              bgColor="bg-neutral-light"
              textColor="text-neutral-dark"
              heading="Carbs"
              unit="carbs"
              value="56"
              iconBgColor="bg-secondary-blue"
              unitColor="text-neutral-default"
            />
          </View>
        </View>
        <View className="flex-row justify-between">
          <View className="w-[47%]">
            <StatBox
              icon={imagePaths.protein_icon}
              bgColor="bg-neutral-light"
              textColor="text-neutral-dark"
              heading="Protein"
              unit="Protein"
              value="45"
              iconBgColor="bg-secondary-purple"
              unitColor="text-neutral-default"
            />
          </View>
          <View className="w-[47%]">
            <StatBox
              icon={imagePaths.calories_icon}
              bgColor="bg-neutral-light"
              textColor="text-neutral-dark"
              heading="Calories"
              unit="KCal"
              value="345"
              iconBgColor="bg-secondary-brown"
              unitColor="text-neutral-default"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
