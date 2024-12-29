import { devURL } from "@/constants/urls";

export const getWatchData = async () => {
  try {
    const res = await fetch(`${devURL}`);
  } catch (error) {
    console.log("Error getting watch data", error);
  }
};
