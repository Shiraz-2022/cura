import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";

// Constants
import { imagePaths } from "@/constants/imagePaths";
import CustomInput from "@/components/micro/CustomInput";
import CustomButton from "@/components/micro/CustomButton";
import { router } from "expo-router";

// API
import { signup } from "@/api/auth";

//utils
import { storeStringData } from "@/utils/asyncStroage";

export default function Signup() {
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    role: "Patient",
  });
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      if (!authData.email || !authData.password) {
        setError("Both fields are required.");
        return;
      }

      setError(""); // Clear previous errors
      const response = await signup(authData);

      if (response.success) {
        storeStringData("userId", response.data.userId);
        router.push("/onBoarding/OnBoarding1");
      } else {
        setError(response.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      router.push("/onBoarding/OnBoarding1");
    }
  };

  return (
    <View className="bg-primary-dark h-full px-10 py-40 items-center">
      <Image source={imagePaths.logo} />
      <View className="w-full">
        <CustomInput
          placeholder="Email"
          placeholderColor="grey"
          textColor="text-primary-dark"
          type="email"
          bgColor="bg-neutral-light"
          containerClass="mb-7 mt-20"
          label="Email"
          value={authData.email}
          onChange={(value: string) =>
            setAuthData({ ...authData, email: value })
          }
        />
        <CustomInput
          placeholder="Password"
          placeholderColor="grey"
          textColor="white"
          type="text"
          bgColor="bg-neutral-light"
          containerClass="mb-20"
          label="Password"
          secure
          value={authData.password}
          onChange={(value: string) =>
            setAuthData({ ...authData, password: value })
          }
        />
      </View>
      {error ? <Text className="text-red-500 mb-5">{error}</Text> : null}
      <CustomButton
        text="Signup"
        onPress={handleSignup}
        textColor="text-primary-light"
        bgColor="bg-tranparent"
        border="border border-neutral-light"
      />
      <Text className="text-neutral-light mt-10">
        Already registered?{" "}
        <Link href="/(auth)/Login" className="font-bold underline">
          Login
        </Link>
      </Text>
    </View>
  );
}
