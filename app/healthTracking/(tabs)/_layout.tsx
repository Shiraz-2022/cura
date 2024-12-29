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
        name="diet"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? imagePaths.diet_icon_filled
                  : imagePaths.diet_icon_outlined
              }
              className="w-7 h-7"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? imagePaths.track_icon_filled
                  : imagePaths.track_icon_outlined
              }
              className="w-7 h-7"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? imagePaths.chatbot_icon_filled
                  : imagePaths.chatbot_icon_outlined
              }
              className="w-7 h-7"
            />
          ),
        }}
      />
    </Tabs>
  );
}
