import { View, Text, Image, ScrollView, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";

//components
import CustomSearch from "@/components/CustomSearch";

//constants
import { imagePaths } from "@/constants/imagePaths";
import SliderSwitch from "@/components/SliderSwitch";

//context
import { useSliderContext } from "@/contexts/SliderSwitchContext";
import Communities from "@/components/Communities";

export default function Group() {
  // const { selected, setSelected } = useSliderContext();

  // useFocusEffect(() => {
  //   if (selected !== "You") {
  //     setSelected("Global");
  //   }
  // });

  return (
    <View className="w-full h-full bg-primary-dark p-5">
      <View className="flex-row items-center justify-between mb-7">
        <Image source={imagePaths.account_icon} className="w-7 h-7" />
        <View className="flex-row items-center gap-7">
          <Pressable onPress={() => router.push("/notifications")}>
            <Image source={imagePaths.notification_icon} className="w-5 h-5" />
          </Pressable>
          <Image source={imagePaths.menu_icon} className="w-5 h-5" />
        </View>
      </View>
      <CustomSearch placeholder="Search communities" onChange={() => {}} />
      {/* <View className="mt-5 px-5">
        <SliderSwitch left="Global" right="You" />
      </View> */}
      <Communities type="you" />
    </View>
  );
}
