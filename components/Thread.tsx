import React, { useState } from "react";
import { View, Text, Image, Pressable, TextInput } from "react-native";

//types
import { ThreadType } from "@/types/api";

//constants
import { imagePaths } from "@/constants/imagePaths";
import { router } from "expo-router";

interface ThreadProps {
  data: ThreadType;
  subThread: boolean;
  level: number;
}

export default function Thread(props: ThreadProps) {
  const { data, subThread, level } = props;

  const [curData, setCurData] = useState(data);
  const [showSubThreads, setShowSubThreads] = useState(false);
  const [reply, setReply] = useState(false);

  console.log("cur", curData);

  const handleThread = () => {
    if (level % 3 === 0) {
      router.push({
        pathname: "/community/(tabs)/group/SelectedDiscussion",
        params: { curData: JSON.stringify(curData.subThreads), id: curData.id },
      });
    } else {
      setShowSubThreads(!showSubThreads);
    }
  };

  return (
    <View className="relative mt-7">
      <View className="flex-row">
        <View className="flex-row">
          {subThread && (
            <View className="absolute -left-5 -top-2 w-6 h-6 border-b border-l border-primary-extraLight rounded-b-lg" />
          )}
          <Image source={imagePaths.pp} className="w-7 h-7" />
          <View className="flex-row items-center gap-2 ml-3 relative">
            <Text className="text-neutral-light font-bold text-xs">
              {curData?.Name}
            </Text>
            <View className="bg-primary-light w-1 h-1 rounded-full" />
            <Text className="text-neutral-light text-xs font-light">
              12hrs ago
            </Text>
          </View>
        </View>
      </View>
      <View className="mt-7 px-12">
        <Text className="font-bold text-neutral-light text-xs">
          {data?.comment}
        </Text>
        {/* <Text className="text-neutral-light font-light my-5 text-xs">
          {data?.subtitle}
        </Text> */}
      </View>
      <View className="flex-row justify-between mt-5 items-center px-12">
        <Pressable className="flex-row rounded-full items-center">
          <Image source={imagePaths.upvote_icon} className="w-5 h-5 mr-2" />
          <Text className="text-xs text-neutral-light">{data?.upvotes}</Text>
          <Image
            source={imagePaths.upvote_icon}
            className="w-5 h-5 ml-2 rotate-180"
          />
        </Pressable>
        <Pressable
          className="flex-row rounded-full items-center"
          onPress={() => setReply(true)}
        >
          <Image source={imagePaths.comment_icon} className="w-5 h-5 mr-2" />
          <Text className="text-xs text-neutral-light">Reply</Text>
        </Pressable>
        <Pressable className="flex-row rounded-full items-center">
          <Image
            source={imagePaths.menu_icon}
            className="w-4 h-4 rotate-90 ml-auto my-auto"
          />
        </Pressable>
      </View>
      {curData.subThreads.length !== 0 && !reply && (
        <View className="absolute left-1 h-full items-center">
          <View className="h-[90%] w-0.5 bg-primary-extraLight" />
          <Pressable onPress={handleThread}>
            <Image
              className="w-5 h-5"
              source={
                showSubThreads
                  ? imagePaths.minus_icon
                  : imagePaths.plus_round_icon
              }
            />
          </Pressable>
        </View>
      )}
      {reply && (
        <Pressable
          className={`${
            reply
              ? "h-40 rounded-lg py-3 bg-primary-extraLight"
              : " justify-center rounded-full items-center py-2 flex-row bg-primary-light"
          }   mx-5 mt-7 px-5`}
          onPress={() => {
            setReply(true);
          }}
        >
          {!reply && (
            <Image source={imagePaths.plus_icon} className="w-5 h-5 mr-2" />
          )}
          {reply ? (
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
          {reply && (
            <View className="flex-row mt-auto">
              <Pressable
                className="flex-row bg-primary-light rounded-full py-2 px-5 items-center mr-3 mt-auto ml-auto"
                onPress={() => {
                  setReply(false);
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
      )}
      {showSubThreads &&
        curData.subThreads.map((subThread, index) => (
          <View key={index} className="ml-8 mt-4">
            <Thread data={subThread} subThread={true} level={level + 1} />
          </View>
        ))}
    </View>
  );
}
