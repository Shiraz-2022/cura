import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

// Constants
import { imagePaths } from "@/constants/imagePaths";
import { chatData as initialChatData } from "@/constants/MockData";

//types
import { ChatType } from "@/types/api";

export default function SingleChat() {
  const [messages, setMessages] = useState(initialChatData);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return; // Prevent sending empty messages

    const newMessage = {
      id: messages.length + 1,
      message: inputMessage,
      timestamp: new Date(),
      isReceived: true, // Adjust this flag based on your requirements
    };

    setMessages([...messages, newMessage]);
    setInputMessage(""); // Clear input after sending
  };

  return (
    <View className="bg-primary-dark w-full h-full">
      {/* Header */}
      <View className="flex-row items-center justify-between bg-primary-light px-3 py-3">
        <View className="flex-row items-center gap-3">
          <Image source={imagePaths.back_icon} className="w-7 h-7" />
          <Image source={imagePaths.pp} className="w-10 h-10 rounded-full" />
          <Text className="font-bold text-neutral-light">Shiraz Yousuf</Text>
        </View>
        <View className="flex-row gap-3">
          <Image
            source={imagePaths.video_call_icon_outlined}
            className="w-7 h-7"
          />
          <Image source={imagePaths.menu_icon} className="w-5 h-5" />
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView
        className="flex-1 px-4 py-3"
        showsVerticalScrollIndicator={false}
      >
        {messages.map((chat) => (
          <View
            key={chat.id}
            className={`flex-row ${
              chat.isReceived ? "justify-start" : "justify-end"
            } my-2`}
          >
            <View
              className={`max-w-3/4 p-3 ${
                chat.isReceived
                  ? "bg-neutral-light text-black rounded-r-lg rounded-b-lg"
                  : "bg-primary-light text-white rounded-l-lg rounded-b-lg"
              }`}
            >
              <Text
                className={`${
                  chat.isReceived ? "text-black" : "text-white"
                } text-sm`}
              >
                {chat.message}
              </Text>
              <Text
                className={`text-xs ${
                  chat.isReceived ? "text-gray-500" : "text-gray-400"
                } mt-1 text-right`}
              >
                {chat.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Section */}
      <View className="flex-row items-center mt-4 mb-7 mx-3 justify-between">
        <View className="bg-neutral-light rounded-lg flex-row py-2 px-4 max-h-52 flex-1">
          <TextInput
            className="flex-1"
            placeholder="Enter your message"
            placeholderTextColor="#B0B0B0"
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
          />
        </View>
        <TouchableOpacity
          className="rounded-full bg-neutral-light p-3"
          onPress={handleSendMessage}
        >
          <Image
            source={imagePaths.sent_icon}
            className="w-7 h-7 ml-auto my-auto"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
