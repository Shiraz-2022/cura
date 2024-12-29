import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from "expo-router";

//constants
import { imagePaths } from "@/constants/imagePaths";

//contexts
import { useSliderContext } from "@/contexts/SliderSwitchContext";

//components
import SliderSwitch from "@/components/SliderSwitch";
import StatBox from "@/components/StatBox";
import StatsScrollView from "@/components/StatsScrollView";
import MealsScrollView from "@/components/MealsScrollView";
import NewLog from "@/components/NewLog";

export default function Diet() {
  const { selected, setSelected } = useSliderContext();

  const [selectedTime, setSelectedTime] = useState<string>("breakfast");

  useFocusEffect(() => {
    if (selected !== "Meals") {
      setSelected("Stats");
    }
  });

  return (
    <View className="bg-primary-dark h-full w-full pt-10 pb-5 px-5">
      <ScrollView className="my-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-7">
          <Image source={imagePaths.account_icon} className="w-7 h-7" />
          <Image source={imagePaths.menu_icon} className="w-5 h-5" />
        </View>

        <Text className="text-neutral-light font-bold text-xl">Hello</Text>
        <Text className="text-neutral-light font-bold text-xl">
          Shiraz Yousuf
        </Text>
        <Text className="text-secondary-light text-lg mt-3">
          Complete your daily required nutritions.
        </Text>

        <View className="my-5 px-5">
          <SliderSwitch left="Stats" right="Meals" />
        </View>

        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => setSelectedTime("breakfast")}
            className={`${
              selectedTime === "breakfast"
                ? "bg-primary-light"
                : "bg-neutral-light"
            } rounded-full w-[31%] py-2`}
          >
            <Text
              className={`${
                selectedTime === "breakfast"
                  ? "text-neutral-light"
                  : "text-primary-light"
              } text-center text-xs`}
            >
              Breakfast
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTime("lunch")}
            className={`${
              selectedTime === "lunch" ? "bg-primary-light" : "bg-neutral-light"
            } rounded-full w-[31%] py-2`}
          >
            <Text
              className={`${
                selectedTime === "lunch"
                  ? "text-neutral-light"
                  : "text-primary-light"
              } text-center text-xs`}
            >
              Lunch
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTime("dinner")}
            className={`${
              selectedTime === "dinner"
                ? "bg-primary-light"
                : "bg-neutral-light"
            } rounded-full w-[31%] py-2`}
          >
            <Text
              className={`${
                selectedTime === "dinner"
                  ? "text-neutral-light"
                  : "text-primary-light"
              } text-center text-xs`}
            >
              Dinner
            </Text>
          </TouchableOpacity>
        </View>
        {selected === "Stats" ? <StatsScrollView /> : <MealsScrollView />}
      </ScrollView>
      <NewLog />
    </View>
  );
}
