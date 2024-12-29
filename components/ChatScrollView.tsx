import { View, Text, Image, Pressable } from "react-native";
import React from "react";

// components
import { imagePaths } from "@/constants/imagePaths";
import { getData } from "@/utils/asyncStroage";

interface ChatScrollViewProps {
  name: string;
  description: string;
  onPress?: () => void; // General onPress for name/description click
  onJoinPress?: () => void; // Specific onPress for the "Join" button
  chat?: boolean;
  community?: boolean;
}

export default function ChatScrollView(props: ChatScrollViewProps) {
  const { name, description, onPress, onJoinPress, chat, community } = props;
  const role = getData("role");

  return (
    <View className="mb-7 flex-row w-full justify-between">
      <View className="flex-row">
        <Image source={imagePaths.pp} className="w-12 h-12 mr-5" />
        <Pressable className="flex-row" onPress={onPress}>
          <View className="justify-between mr-5">
            <Text className="text-neutral-light text-sm font-bold">{name}</Text>
            <Text className="text-neutral-light text-xs">{description}</Text>
          </View>
        </Pressable>
      </View>

      {chat && (
        <View className="bg-secondary-light w-5 h-5 rounded-full my-auto justify-center items-center">
          <Text className="text-xs text-neutral-light">2</Text>
        </View>
      )}

      {community && (
        <Pressable
          className="bg-primary-light rounded-full px-5 h-7 my-auto justify-center ml-3"
          onPress={onJoinPress} // Calls the specific onPress for the Join button
        >
          <Text className="text-xs text-neutral-light">Join</Text>
        </Pressable>
      )}
      {role === "Doctor" && (
        <Pressable className="bg-secondary-light rounded-full px-5 h-7 my-auto justify-center ml-3">
          <Text className="text-xs text-neutral-light">Doctor</Text>
        </Pressable>
      )}
    </View>
  );
}
