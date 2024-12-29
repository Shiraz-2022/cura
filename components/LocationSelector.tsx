import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";
import CountryFlag from "react-native-country-flag";

//api
import { autoCompleteLocation } from "../api/autoCompleteLocation";

//components
import CustomInput from "./micro/CustomInput";

// Location Context
import { useLocation } from "@/contexts/LocationContext";

export default function LocationSelector() {
  const { setLocation } = useLocation(); // Access the setLocation function from context
  const [locData, setLocData] = useState(null);
  const [locValue, setLocValue] = useState<string>("");
  const [coordinates, setCoordinates] = useState<number[] | null>(null);
  const [dropdown, setDropdown] = useState<boolean>(false);

  const updateLocation = async (value: string) => {
    console.log("loc val:", value);
    setLocValue(value);

    if (value.trim() !== "") {
      setDropdown(true);
      const data = await autoCompleteLocation(value);
      setLocData(data);
    } else {
      setLocData(null);
      setDropdown(false);
    }
  };

  const handleLocSelect = (loc: string, coords: number[]) => {
    setLocValue(loc);
    setCoordinates(coords);
    setDropdown(false);
    console.log("Selected Location:", loc);
    console.log("Selected Coordinates:", coords);

    // Update the location context with the selected location and coordinates
    setLocation({
      name: loc,
      coordinates: coords,
    });
  };

  return (
    <View className="relative">
      <CustomInput
        placeholder="Select your location"
        placeholderColor="grey"
        textColor="white"
        type="text"
        bgColor="bg-neutral-light"
        label="Location"
        value={locValue}
        onChange={updateLocation}
      />
      {dropdown && (
        <ScrollView className="bg-neutral-light rounded-md absolute bottom-0 mb-24 max-h-60 w-full z-50">
          {locData?.features &&
            locData.features.map((feature, index: number) => (
              <Pressable
                key={index}
                onPress={() =>
                  handleLocSelect(
                    feature?.properties?.name,
                    feature?.geometry?.coordinates
                  )
                }
                className="text-primary-dark text-sm py-3 px-5 flex-row items-center"
              >
                {feature?.properties?.country_code && (
                  <CountryFlag
                    isoCode={feature.properties.country_code}
                    size={25}
                  />
                )}

                <Text className="ml-3 text-xs font-light">
                  {feature?.properties?.name}, {feature?.properties?.region}
                </Text>
              </Pressable>
            ))}
        </ScrollView>
      )}
    </View>
  );
}
