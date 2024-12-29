import { View, Text, Image, ScrollView } from "react-native";
import React from "react";

//constants
import { imagePaths } from "@/constants/imagePaths";

//components
import CommunityDiscussionScroll from "./CommunityDiscussionScroll";

interface CommunityDiscussionProps {
  data: any;
}

export default function CommunityDiscussions(props: CommunityDiscussionProps) {
  const { data } = props;
  console.log("data", data);
  return (
    <View className="mt-7">
      <View className="flex-row w-fit items-center px-5">
        <Text className="text-neutral-light mr-3">New</Text>
        <Image source={imagePaths.expand_arrow_icon} className="w-4 h-4" />
      </View>
      <ScrollView className="mt-7 mb-40" showsVerticalScrollIndicator={false}>
        {data &&
          data.length &&
          data.length !== 0 &&
          data.map((item, index) => (
            <View key={index}>
              <CommunityDiscussionScroll data={item} />
            </View>
          ))}
      </ScrollView>
    </View>
  );
}
