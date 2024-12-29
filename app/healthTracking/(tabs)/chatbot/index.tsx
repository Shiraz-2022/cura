import { View, Text, Image, ScrollView, TextInput } from "react-native";
import React from "react";

// Constants
import { imagePaths } from "@/constants/imagePaths";
import { chatbotData } from "@/constants/MockData";

//types
import { ChatbotType } from "@/types/api";

export default function SingleChat() {
  return (
    <View className="bg-primary-dark w-full h-full">
      <View className="flex-row items-center justify-between bg-primary-light px-3 py-3">
        <View className="flex-row items-center gap-3">
          <Image source={imagePaths.back_icon} className="w-7 h-7" />
          <Image source={imagePaths.pp} className="w-10 h-10 rounded-full" />
          <Text className="font-bold text-neutral-light">ChatBot</Text>
        </View>
        <Image source={imagePaths.menu_icon} className="w-5 h-5" />
      </View>
      <ScrollView
        className="flex-1 px-4 py-3"
        showsVerticalScrollIndicator={false}
      >
        {chatbotData.map((chat: ChatbotType) => (
          <React.Fragment key={chat.id}>
            <View className="flex-row justify-end my-2">
              <View className="max-w-3/4 p-3 bg-primary-light text-white rounded-l-lg rounded-b-lg">
                <Text className="text-white text-sm">{chat.prompt}</Text>
                <Text className="text-xs text-gray-400 mt-1 text-right">
                  {chat.timestamp.toDateString()}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-start my-2">
              <View className="max-w-3/4 p-3 bg-neutral-light text-black rounded-r-lg rounded-b-lg">
                <Text className="text-black text-sm">{chat.reply}</Text>
                <Text className="text-xs text-gray-500 mt-1 text-right">
                  {chat.timestamp.toDateString()}
                </Text>
              </View>
            </View>
          </React.Fragment>
        ))}
      </ScrollView>
      <View className="flex-row items-center mt-4 mb-7 mx-3 justify-between">
        <View className="bg-neutral-light rounded-lg flex-row py-2 px-4 max-h-52">
          <TextInput
            className="w-5/6"
            placeholder="Enter your prompt"
            placeholderTextColor=""
            scrollEnabled
            multiline
          />
        </View>
        <View className="rounded-full bg-neutral-light p-3">
          <Image
            source={imagePaths.sent_icon}
            className="w-7 h-7 ml-auto my-auto"
          />
        </View>
      </View>
    </View>
  );
}
