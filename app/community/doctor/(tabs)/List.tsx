import { View, Text, Image, ScrollView, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";

//constants
import { imagePaths } from "@/constants/imagePaths";

//components
import CustomSearch from "@/components/CustomSearch";
import ChatScrollView from "@/components/ChatScrollView";

export default function List() {
  return (
    <View className="w-full h-full bg-primary-dark p-5">
      <View className="flex-row items-center justify-between mb-7">
        <Image source={imagePaths.account_icon} className="w-7 h-7" />
        <View className="flex-row items-center gap-7">
          <Pressable onPress={() => router.push("/notifications")}>
            <Image source={imagePaths.notification_icon} className="w-5 h-5" />
          </Pressable>
          <Image source={imagePaths.menu_icon} className="w-5 h-5" />
        </View>
      </View>
      <Text className="text-secondary-light font-bold text-lg mt-5">
        These are the list of communities you can join
      </Text>
      <ScrollView className="my-10" showsVerticalScrollIndicator={false}>
        <ChatScrollView
          name="Shiraz yousuf"
          description="This is part of the last text message....."
        />
        <ChatScrollView
          name="Shiraz yousuf"
          description="This is part of the last text message....."
        />
        <ChatScrollView
          name="Shiraz yousuf"
          description="This is part of the last text message....."
        />
      </ScrollView>
    </View>
  );
}
