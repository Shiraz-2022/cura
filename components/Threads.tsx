import { View, Text, Image } from "react-native";
import React from "react";

//constants
import { imagePaths } from "@/constants/imagePaths";

//types
import { ThreadType } from "@/types/api";

//components
import Thread from "./Thread";

interface ThreadsProps {
  data: any;
}

export default function Threads(props: ThreadsProps) {
  const { data } = props;

  // console.log("thread", data);

  return (
    <View className="px-5 mt-7">
      <View className="flex-row items-center">
        <Text className="text-neutral-light text-xs">Sort by : </Text>
        <View className="flex-row w-fit items-center px-5">
          <Text className="text-neutral-light mr-3 text-xs">New</Text>
          <Image source={imagePaths.expand_arrow_icon} className="w-4 h-4" />
        </View>
      </View>
      {data &&
        data.map((thread, index) => (
          <Thread key={index} data={thread} subThread={false} level={1} />
        ))}
    </View>
  );
}
