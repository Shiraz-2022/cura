import { View, Text, Image, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";

// constants
import { imagePaths } from "@/constants/imagePaths";

// components
import CustomSearch from "@/components/CustomSearch";
import ChatScrollView from "@/components/ChatScrollView";
import CustomModal from "@/components/micro/CustomModal"; // Import the custom modal

// api
import { searchCommunites, joinCommunity } from "@/api/community";

export default function Find() {
  const [searchResults, setSearchResults] = useState([]); // For storing API results
  const [modalVisible, setModalVisible] = useState(false); // For modal visibility
  const [modalMessage, setModalMessage] = useState(""); // For modal message

  const fetchSearchResults = async (text: string) => {
    console.log("Searching for:", text);
    if (text.trim() === "") {
      setSearchResults([]); // Clear results if input is empty
      return;
    }
    try {
      const results = await searchCommunites(text);
      console.log("ser", results); // Call API with search text
      setSearchResults(results?.communities || []);
    } catch (error) {
      console.log("Error fetching search results:", error);
    }
  };

  const handleJoin = async (communityId: string) => {
    console.log("handle");
    const userId = "currentUserId"; // Replace with actual user ID
    try {
      await joinCommunity(communityId, userId);
      setModalMessage("Successfully joined the community!");
      setModalVisible(true);
    } catch (error) {
      setModalMessage("Error joining the community. Please try again later.");
      setModalVisible(true);
    }
  };

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
      <CustomSearch
        placeholder="Search people or communities"
        onChange={fetchSearchResults} // Trigger search on text change
        onPress={fetchSearchResults} // Trigger search on button press
      />
      <ScrollView className="my-10" showsVerticalScrollIndicator={false}>
        {searchResults.length > 0 ? (
          searchResults.map((result, index) => (
            <ChatScrollView
              key={index}
              name={result?.title}
              description={result?.subtitle}
              community={true}
              onJoinPress={() => handleJoin(result.id)} // Handle Join button click
            />
          ))
        ) : (
          <Text className="text-gray-400">No results found</Text>
        )}
      </ScrollView>

      {/* Custom Modal to display messages */}
      <CustomModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
