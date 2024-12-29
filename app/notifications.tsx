import React from "react";
import { View, Text, ScrollView } from "react-native";

export default function Notifications() {
  const notifications = [
    { id: 1, message: "Your subscription has been renewed successfully!" },
    { id: 2, message: "A new advocate has joined the platform." },
    { id: 3, message: "Your profile was viewed 15 times this week." },
    { id: 4, message: "Don't miss out on our new features update!" },
    { id: 5, message: "Payment for subscription is due in 3 days." },
    { id: 6, message: "Your case summary has been updated." },
  ];

  return (
    <View className="flex-1 bg-gray-100">
      <Text className="text-lg font-bold text-center my-4">Notifications</Text>
      <ScrollView className="px-4">
        {notifications.map((notification) => (
          <View
            key={notification.id}
            className="bg-white p-4 rounded-lg mb-4 shadow-md"
          >
            <Text className="text-sm text-gray-700">
              {notification.message}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
