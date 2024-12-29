export const autoCompleteLocation = async (searchText) => {
  try {
    const query = new URLSearchParams({
      api_key: process.env.EXPO_PUBLIC_GEO_CODE_EARTH_API_KEY,
      text: searchText || "",
      "focus.point.lat": "38.82",
      "focus.point.lon": "77.01",
    });

    const res = await fetch(
      `https://api.geocode.earth/v1/autocomplete?${query.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      console.error(`Error getting location: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return null;
  }
};
