import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";

//context
import { useSliderContext } from "@/contexts/SliderSwitchContext";

//constants
import { imagePaths } from "@/constants/imagePaths";

//components
import CustomSearch from "@/components/CustomSearch";
import CommunityChats from "@/components/CommunityChats";
import CommunityDiscussions from "@/components/CommunityDiscussions";
import SliderSwitch from "@/components/SliderSwitch";
import { getChats, getDiscussion } from "@/api/community";

export default function CommunityDetails() {
  const { selected, setSelected } = useSliderContext();
  const params = useLocalSearchParams();
  const { data } = params;
  const [discussions, setDiscussions] = useState({});
  const [chats, setChats] = useState({});

  useEffect(() => {
    setSelected("Chats");
  }, []);

  useEffect(() => {
    if (selected == "Chats") {
      // const fetchChats = async () => {
      //   const res = getChats("", "");
      //   setChats(res);
      // };
      // fetchChats();
    } else {
      const fetchDiscussions = async () => {
        const res = await getDiscussion(data.id);
        console.log("res data", res);
        setDiscussions(res.posts);
      };
      fetchDiscussions();
    }
  }, [selected]);

  return (
    <View className="w-full h-full bg-primary-dark py-5">
      <View className="flex-row items-center justify-between mb-7 px-5">
        <Image source={imagePaths.account_icon} className="w-7 h-7" />
        <Image source={imagePaths.menu_icon} className="w-5 h-5" />
      </View>
      <View className="px-5">
        <CustomSearch placeholder="Search chats or discussion" />
      </View>

      <View className="mt-5 px-10">
        <SliderSwitch left="Chats" right="Discussions" />
      </View>
      {selected === "Chats" ? (
        <CommunityChats data={chats} />
      ) : (
        <CommunityDiscussions data={discussions} />
      )}
    </View>
  );
}
