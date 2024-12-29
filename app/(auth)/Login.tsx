import { View, Text, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";

//constants
import { imagePaths } from "@/constants/imagePaths";
import CustomInput from "@/components/micro/CustomInput";
import CustomButton from "@/components/micro/CustomButton";
import { router } from "expo-router";

export default function Login() {
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
        />
      </View>
      <CustomButton
        text="login"
        onPress={() => {
          router.push("/onBoarding/OnBoarding2");
        }}
        textColor="text-primary-light"
        bgColor="bg-tranparent"
        border="border border-neutral-light"
      />
      <Text className="text-neutral-light mt-10">
        Not registered?{" "}
        <Link href="/(auth)/Signup" className="font-bold underline">
          SignUp
        </Link>
      </Text>
    </View>
  );
}
