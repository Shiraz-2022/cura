import { Tabs } from "expo-router";
import { Image, View } from "react-native";

//constants
import { imagePaths } from "@/constants/imagePaths";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#01161E",
          // height: 60,
          // position: "absolute",
          // bottom: 0,
          // left: 0,
          // zIndex: 5,
        },
        tabBarIconStyle: {
          marginVertical: "auto",
        },
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? imagePaths.chat_icon_filled
                  : imagePaths.chat_icon_outlined
              }
              className="w-7 h-7"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="group"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? imagePaths.group_icon_filled
                  : imagePaths.group_icon_outlined
              }
              className="w-7 h-7"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Find"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? imagePaths.find_icon_filled
                  : imagePaths.find_icon_outlined
              }
              className="w-7 h-7"
            />
          ),
        }}
      />
    </Tabs>
  );
}
