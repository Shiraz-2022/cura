import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";

//constants
import { imagePaths } from "@/constants/imagePaths";

interface CommunityDiscussionScrollProps {
  data: any;
}

export default function CommunityDiscussionScroll(
  props: CommunityDiscussionScrollProps
) {
  const { data } = props;
  return (
    <View className="mb-10 px-5 pb-7 border-b-0.5 border-b-primary-light border-opacity-30">
      <View className="flex-row">
        <View className="flex-row">
          <Image source={imagePaths.pp} className="w-10 h-10" />
          <View className="flex-row items-center gap-3 ml-3">
            <Text className="text-neutral-light font-bold text-xs">
              {data.user.name}
            </Text>
            <View className="bg-primary-light w-1 h-1 rounded-full" />
            <Text className="text-neutral-light text-xs font-light">
              12hrs ago
            </Text>
          </View>
          <Pressable className="bg-primary-light rounded-full px-5 h-7 my-auto justify-center ml-3">
            <Text className="text-xs text-neutral-light">Join</Text>
          </Pressable>
        </View>
        <Image
          source={imagePaths.menu_icon}
          className="w-4 h-4 rotate-90 ml-auto my-auto"
        />
      </View>
      <Pressable
        className="mt-7"
        onPress={() =>
          router.push({
            pathname: "/community/(tabs)/group/SelectedDiscussion",
            params: { data: JSON.stringify(data) },
          })
        }
      >
        <Text className="font-bold text-neutral-light">{data.title}</Text>
        <Text className="text-neutral-light font-light my-5">
          {data.subtitle}
        </Text>
      </Pressable>
      <Image source={{ uri: data.image }} className="rounded-lg w-full h-52" />
      <View className="flex-row justify-between mt-7 items-center">
        <Pressable className="flex-row bg-primary-light rounded-full py-2 px-5 items-center">
          <Image source={imagePaths.upvote_icon} className="w-5 h-5 mr-2" />
          <Text className="text-xs text-neutral-light">
            {data.likes?.length}
          </Text>
          <Image source={imagePaths.upvote_icon} className="w-5 h-5 ml-2" />
        </Pressable>
        <Pressable className="flex-row bg-primary-light rounded-full py-2 px-5 items-center">
          <Image source={imagePaths.comment_icon} className="w-5 h-5 mr-2" />
          <Text className="text-xs text-neutral-light">
            {data.threads?.length}
          </Text>
        </Pressable>
        <Pressable className="flex-row bg-primary-light rounded-full py-2 px-5 items-center">
          <Image source={imagePaths.share_icon} className="w-5 h-5 mr-2" />
          <Text className="text-xs text-neutral-light">Share</Text>
        </Pressable>
      </View>
    </View>
  );
}
