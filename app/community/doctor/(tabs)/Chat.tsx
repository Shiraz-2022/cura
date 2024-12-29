import { View, Text, ScrollView, Image, Pressable } from "react-native";
import React from "react";

//components
import CustomSearch from "@/components/CustomSearch";
import ChatScrollView from "@/components/ChatScrollView";
import { imagePaths } from "@/constants/imagePaths";
import { router } from "expo-router";

export default function Chat() {
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
      <CustomSearch placeholder="Search chats" />
      <ScrollView className="mt-10" showsVerticalScrollIndicator={false}>
        <ChatScrollView
          name="Shiraz yousuf"
          description="Hey, can we meet today at th..."
          onPress={() => router.push("/community/(tabs)/chat/SingleChat")}
        />
        <ChatScrollView
          name="Yadu Krishna"
          description="yeah i tottally agree with y..."
          onPress={() => router.push("/community/(tabs)/chat/SingleChat")}
        />
        <ChatScrollView
          name="Heth Koorma"
          description="thats great then, i hop you imp..."
          onPress={() => router.push("/community/(tabs)/chat/SingleChat")}
        />
        <ChatScrollView
          name="G Prashant"
          description="you know something i faced the sam..."
          onPress={() => router.push("/community/(tabs)/chat/SingleChat")}
        />
      </ScrollView>
    </View>
  );
}
