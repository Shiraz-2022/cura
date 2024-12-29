import { View, Text, ScrollView } from "react-native";
import React from "react";
import ChatScrollView from "@/components/ChatScrollView";

interface CommunityChatsProps {
  data: any;
}

export default function CommunityChats(props: CommunityChatsProps) {
  const { data } = props;
  return (
    <ScrollView
      className="mt-10 w-full px-5"
      showsVerticalScrollIndicator={false}
    >
      <ChatScrollView
        name="Shiraz yousuf"
        description="This is part of the last message..."
        chat={true}
      />
    </ScrollView>
  );
}
