import React, { useState, useRef } from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";

// Constants
import { imagePaths } from "@/constants/imagePaths";
import CameraComponent from "./Camera";

export default function NewLog() {
  const [expanded, setExpanded] = useState(false); // State to track if the menu is expanded
  const heightAnim = useRef(new Animated.Value(50)).current; // Animation for height

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
    Animated.timing(heightAnim, {
      toValue: expanded ? 50 : 240, // Collapsed height: 50, Expanded height: 200
      duration: 300, // Animation duration in ms
      useNativeDriver: false, // We need to update layout, so native driver is false
    }).start();
  };

  return (
    <Animated.View
      style={{
        height: heightAnim,
        backgroundColor: "#778DA9",
        borderRadius: 25,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        padding: expanded ? 10 : 0,
        position: "relative",
      }}
    >
      {expanded && (
        <View className="w-full px-4 mb-5">
          <View className="bg-neutral-light opacity-10 absolute -rotate-45 -left-20 top-0 w-full h-12" />
          <View className="bg-neutral-light opacity-10 absolute -rotate-45 -right-20 -bottom-10 w-full h-12" />
          {/* <View className="flex-row justify-between"> */}
          <TouchableOpacity className="items-center">
            {/* <Image source={imagePaths.camera_icon} className="w-7 h-7" />
            <Text className="text-primary-dark mt-2 text-xs">Upload Image</Text> */}
            <View className="mt-12">
              <CameraComponent />
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity className="items-center">
              <Image source={imagePaths.mic_icon} className="w-7 h-7" />
              <Text className="text-primary-dark mt-2 text-xs">
                Voice Logging
              </Text>
            </TouchableOpacity> */}
          {/* </View> */}
          {/* <TouchableOpacity className="items-center mt-4">
            <Image source={imagePaths.hand_icon} className="w-7 h-7" />
            <Text className="text-primary-dark mt-2 text-xs">
              Enter Manually
            </Text>
          </TouchableOpacity> */}
        </View>
      )}
      <TouchableOpacity
        onPress={toggleExpand}
        className={`flex-row bg-primary-light items-center rounded-full ${
          expanded ? "justify-center" : "justify-between w-full"
        }`}
      >
        {!expanded && (
          <Text className="text-neutral-light mx-auto">Add new log</Text>
        )}
        <View className="bg-neutral-light rounded-full p-3 m-1">
          <Image
            source={
              expanded ? imagePaths.close_icon : imagePaths.plus_icon_blue
            }
            className="w-5 h-5"
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
