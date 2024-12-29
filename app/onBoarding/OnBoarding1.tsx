import { View, Text } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";

//components
import CustomInput from "@/components/micro/CustomInput";
import CustomButton from "@/components/micro/CustomButton";
import LocationSelector from "@/components/LocationSelector";

// API call function
import { postUserOnboardingData } from "@/api/userOnboarding";

// Location Context
import { useLocation } from "@/contexts/LocationContext";

export default function OnBoarding1() {
  const { location } = useLocation(); // Access location from context
  const [userData, setUserData] = useState({ name: "", age: "" });

  const handleSubmit = async () => {
    if (!location) {
      console.error("Location is required");
      return;
    }

    try {
      const dataToSend = {
        ...userData,
        location: location.name,
        coordinates: location.coordinates,
      };

      // Send the user data to the backend
      const data = await postUserOnboardingData(dataToSend);
      console.log("User data posted successfully:", data);

      // Redirect to the next page
      router.push("/onBoarding/OnBoarding2");
    } catch (error) {
      console.error("Error submitting user data:", error);
    } finally {
      router.push("/onBoarding/OnBoarding2");
    }
  };

  return (
    <View className="bg-primary-dark w-full h-full py-20 px-10">
      <View className="w-full">
        <CustomInput
          placeholder="Enter your name"
          placeholderColor="grey"
          textColor="text-primary-dark"
          type="email"
          bgColor="bg-neutral-light"
          containerClass="mb-10 mt-10"
          label="Name"
          value={userData.name}
          onChange={(text: string) =>
            setUserData((prev) => ({ ...prev, name: text }))
          }
        />
        <CustomInput
          placeholder="Enter your age"
          placeholderColor="grey"
          textColor="white"
          type="numeric"
          bgColor="bg-neutral-light"
          containerClass="mb-10"
          label="Age"
          value={userData.age}
          onChange={(text: string) =>
            setUserData((prev) => ({ ...prev, age: text }))
          }
        />
        <LocationSelector />
      </View>
      <CustomButton
        text="Next"
        bgColor="bg-transparent"
        textColor="text-primary-light"
        border="border border-neutral-light"
        onPress={handleSubmit}
        containerClass="mt-20"
      />
    </View>
  );
}
