import { prodURL, devURL } from "@/constants/urls";
import { getData } from "@/utils/asyncStroage";

export const postUserOnboardingData = async (userData: {
  name: string;
  age: string;
  location: string;
}) => {
  try {
    const newUserData = { ...userData, userId: "676f7ff7a10211c385b3b1f3" };
    console.log("daya", getData("userId"));
    const response = await fetch(`${devURL}/api/auth/update-user-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserData),
    });

    if (!response.ok) {
      throw new Error("Failed to post user data");
    }

    const data = await response.json();
    return data; // Return the response data from the server
  } catch (error) {
    console.error("Error posting user data:", error);
    throw error; // Rethrow the error if needed
  }
};
