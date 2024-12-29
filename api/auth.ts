import { prodURL, devURL } from "@/constants/urls";

export const signup = async (authData: {
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const response = await fetch(`${devURL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Error" };
    }

    const data = await response.json();

    console.log(data);
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "An error occurred. Please try again." };
  }
};
