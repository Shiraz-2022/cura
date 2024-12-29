import { devURL } from "@/constants/urls";

export const getCommunities = async (type: string) => {
  try {
    const url =
      type === "global"
        ? `${devURL}/api/communities/${type}`
        : `${devURL}/api/communities/${type}/676f7ff7a10211c385b3b1f3`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching communities: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.communities;
  } catch (error) {
    console.error("Failed to fetch communities:", error);
    throw error;
  }
};

// api/community.js

export const getDiscussion = async (communityId: string) => {
  try {
    const response = await fetch(
      `${devURL}/api/communities/posts/676fc3532b8185c9f796c7f1`
    );
    if (!response.ok) {
      console.log("Failed to fetch discussions");
      return null;
    }

    const data = await response.json();
    console.log("disc data", data);
    return data;
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return null;
  }
};

// api/community.js

export const getChats = async (communityId: string, userId: "") => {
  try {
    const response = await fetch(
      `https://your-api-url/communities/${communityId}/chats?userId=${userId}`
    );
    if (!response.ok) {
      console.log("Failed to fetch chats");
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return null;
  }
};

export const searchCommunites = async (query: string) => {
  try {
    const response = await fetch(
      `${devURL}/api/communities/search?query=${query}`,
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      console.log("Failed to fetch communities");
      return null;
    }
    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.log("Error searching communities:", error);
  }
};

export const joinCommunity = async (communityId: string, userId: string) => {
  try {
    const endpoint = `${devURL}/api/community/join`;
    console.log("...loading");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        communityId,
        userId,
      }),
    });

    if (!response.ok) {
      console.error("Failed to join the community", response.statusText);
      return null;
    }

    const data = await response.json();
    console.log("Successfully joined the community");
    return data;
  } catch (error) {
    console.error("Error joining the community:", error);
    throw error;
  }
};
