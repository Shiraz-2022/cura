import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";

//constants
import { imagePaths } from "@/constants/imagePaths";
import { threadData } from "@/constants/MockData";

//types
import { ThreadType } from "@/types/api";

//components
import Threads from "./Threads";

interface SingleDiscussionViewProps {
  singleData: any;
}

export default function SingleDiscussionView(props: SingleDiscussionViewProps) {
  const { singleData } = props;
  console.log("singleData", singleData);
  const [comment, setComment] = useState<boolean>(false);
  const params = useLocalSearchParams();
  const { data } = params;
  const parsedData = data ? JSON.parse(data as string) : singleData;

  return singleData ? (
    <ScrollView className="mb-5" showsVerticalScrollIndicator={false}>
      <View className="flex-row px-5">
        <View className="flex-row">
          <Image source={imagePaths.pp} className="w-10 h-10" />
          <View className="flex-row items-center gap-3 ml-3">
            <Text className="text-neutral-light font-bold text-xs">
              {singleData.user?.name}
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
      <Pressable className="mt-7 px-5">
        <Text className="font-bold text-neutral-light">{singleData.title}</Text>
        <Text className="text-neutral-light font-light my-5">
          {singleData.subtitle}
        </Text>
      </Pressable>
      <Image source={imagePaths.food} className="w-full" />
      <View className="flex-row justify-between mt-7 items-center px-5">
        <Pressable className="flex-row bg-primary-light rounded-full py-2 px-5 items-center">
          <Image source={imagePaths.upvote_icon} className="w-5 h-5 mr-2" />
          <Text className="text-xs text-neutral-light">
            {singleData.likes?.length}
          </Text>
          <Image
            source={imagePaths.upvote_icon}
            className="w-5 h-5 ml-2 rotate-180"
          />
        </Pressable>
        <Pressable className="flex-row bg-primary-light rounded-full py-2 px-5 items-center">
          <Image source={imagePaths.comment_icon} className="w-5 h-5 mr-2" />
          <Text className="text-xs text-neutral-light">
            {singleData.comments?.length}
          </Text>
        </Pressable>
        <Pressable className="flex-row bg-primary-light rounded-full py-2 px-5 items-center">
          <Image source={imagePaths.share_icon} className="w-5 h-5 mr-2" />
          <Text className="text-xs text-neutral-light">Share</Text>
        </Pressable>
      </View>
      <Pressable
        className={`${
          comment
            ? "h-40 rounded-lg py-3 bg-primary-extraLight"
            : " justify-center rounded-full items-center py-2 flex-row bg-primary-light"
        }   mx-5 mt-7 px-5`}
        onPress={() => {
          setComment(true);
        }}
      >
        {!comment && (
          <Image source={imagePaths.plus_icon} className="w-5 h-5 mr-2" />
        )}
        {comment ? (
          <TextInput
            placeholder="Add comment"
            placeholderTextColor="#E0E1DD"
            className="text-xs h-20 text-neutral-light"
            multiline
            scrollEnabled
          />
        ) : (
          <Text className="text-xs text-neutral-light">Add comment</Text>
        )}
        {comment && (
          <View className="flex-row mt-auto">
            <Pressable
              className="flex-row bg-primary-light rounded-full py-2 px-5 items-center mr-3 mt-auto ml-auto"
              onPress={() => {
                setComment(false);
              }}
            >
              <Text className="text-xs text-neutral-light">Cancel</Text>
            </Pressable>
            <Pressable className="flex-row bg-neutral-light rounded-full py-2 px-5 items-center">
              <Text className="text-xs text-primary-light">Comment</Text>
            </Pressable>
          </View>
        )}
      </Pressable>
      <Threads data={parsedData.threads} />
    </ScrollView>
  ) : null;
}
