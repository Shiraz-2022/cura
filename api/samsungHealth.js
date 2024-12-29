import { NativeModules } from "react-native";
const { SamsungHealthModule } = NativeModules;

const fetchStepCount = async () => {
  try {
    const steps = await SamsungHealthModule.getStepCount();
    console.log("Step count:", steps);
  } catch (error) {
    console.error("Error fetching step count:", error);
  }
};

useEffect(() => {
  fetchStepCount();
}, []);
