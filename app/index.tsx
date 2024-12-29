import { Text, View, Image, Pressable } from "react-native";
import { router } from "expo-router";

//constants
import { imagePaths } from "../constants/imagePaths";

//components
import CustomInput from "@/components/micro/CustomInput";
import CustomButton from "@/components/micro/CustomButton";
import { useState } from "react";

//utils
import { storeStringData } from "@/utils/asyncStroage";

export default function Index() {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelected = (key: string) => {
    storeStringData("role", selected);
    setSelected(key);
    console.log("type", selected);
  };

  return (
    <View className="bg-primary-dark h-full w-full items-center py-40 px-10">
      <Image source={imagePaths.logo} />
      <View className="w-full mt-20">
        <CustomButton
          text="Patient"
          bgColor="bg-neutral-light"
          textColor="text-primary-dark"
          containerClass="mb-5"
          onPress={() => handleSelected("Patient")}
          border={selected === "Patient" ? "border border-secondary-light" : ""}
        />

        <CustomButton
          text="Doctor"
          bgColor="bg-neutral-light"
          textColor="text-primary-dark"
          containerClass="mb-20"
          onPress={() => handleSelected("Doctor")}
          border={selected === "Doctor" ? "border border-secondary-light" : ""}
        />
      </View>
      <CustomButton
        text="Let's begin"
        bgColor="bg-transparent"
        textColor="text-primary-light"
        border="border border-neutral-light"
        onPress={() => {
          selected === "Doctor"
            ? router.push("/community/doctor/(tabs)/Chat")
            : router.push("/(auth)/Login");
        }}
      />
    </View>
  );
}
