import { View, Text, Image } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

//constants
import { imagePaths } from "@/constants/imagePaths";
import SingleDiscussionView from "@/components/SingleDiscussionView";

export default function SelectedDiscussion() {
  const params = useLocalSearchParams();
  const { data } = params;
  const parsedData = JSON.parse(data as string);

  console.log("single", data);
  return (
    <View className="w-full h-full bg-primary-dark pt-5 mb-7">
      <View className="flex-row items-center justify-between mb-7 px-5">
        <Image source={imagePaths.account_icon} className="w-7 h-7" />
        <Image source={imagePaths.menu_icon} className="w-5 h-5" />
      </View>
      <SingleDiscussionView singleData={parsedData} />
    </View>
  );
}
