import React, { useState } from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { imagePaths } from "@/constants/imagePaths";
import { devURL } from "@/constants/urls";
import { storeStringData } from "@/utils/asyncStroage";
import StatsScrollView from "@/components/StatsScrollView";
import NewLog from "@/components/NewLog";
import * as Linking from "expo-linking"

export default function Diet() {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const connectWatch = async () => {
    try {
      setLoading(true);

      // const callbackUrl = Linking.createURL("App", { scheme: "myapp" });
      const callbackUrl = "myapp://healthTracking/tracking";

      console.log(callbackUrl);

      // Open the authentication session
      const result = await WebBrowser.openAuthSessionAsync(
        `${devURL}/api/auth/google?${callbackUrl}`,
       callbackUrl
      );

      console.log("res",result)

      if (result.type === "success" && result.url) {
        // Extract the access token from the callback URL
        const urlParams = new URLSearchParams(result.url.split("?")[1]);
        const accessToken = urlParams.get("access_token"); // Extract the access token from the URL

        if (accessToken) {
          // Store the access token and update the state
          await storeStringData("accessToken", accessToken);
          setConnected(true);
          console.log("Successfully connected to watch");
        } else {
          console.log("Access token not found in the URL");
        }
      } else {
        console.log("Authentication failed or was canceled");
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error connecting to watch", error);
    }
  };

  return (
    <View className="bg-primary-dark h-full w-full pt-10 pb-5 px-5">
      <ScrollView className="my-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-7">
          <Image source={imagePaths.account_icon} className="w-7 h-7" />
          <Image source={imagePaths.menu_icon} className="w-5 h-5" />
        </View>

        <Text className="text-neutral-light font-bold text-xl">Hello</Text>
        <Text className="text-neutral-light font-bold text-xl">
          Shiraz Yousuf
        </Text>
        <Text className="text-secondary-light text-lg mt-3">
          See your health stats here.
        </Text>

        {/* <View className="my-5 px-5">
          <SliderSwitch left="Stats" right="Meals" />
        </View> */}
        <StatsScrollView />
        <Pressable className="flex-row justify-between bg-neutral-light w-full items-center rounded-full my-7 p-1" onPress={connectWatch} disabled={connected}>
          <Text className="text-primary-dark px-5">{loading ? "Connecting...":connected ?  "Connected":"Connect"} > > ></Text>
          <View className="bg-secondary-light rounded-full p-3">
          <Image source={imagePaths.watch_icon}/>
          </View>
        </Pressable>
      </ScrollView>
      <NewLog />
    </View>
  );
}
