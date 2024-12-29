import { View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";

//components
import ChatScrollView from "./ChatScrollView";

//api
import { getCommunities } from "@/api/community";

interface CommunitiesProps {
  type: string;
}

export default function Communities(props: CommunitiesProps) {
  const { type } = props;

  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const communitiesData = await getCommunities(type);
        setCommunities(communitiesData);
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    };

    fetchCommunities();
  });

  return (
    <ScrollView className="mt-10" showsVerticalScrollIndicator={false}>
      {communities.map((community, index) => (
        <View key={index}>
          <ChatScrollView
            name={community.title}
            description={community.subtitle}
            onPress={() =>
              router.push({
                pathname: `/community/(tabs)/group/CommunityDetails`,
                params: { data: community },
              })
            }
            chat={false}
          />
        </View>
      ))}
    </ScrollView>
  );
}
