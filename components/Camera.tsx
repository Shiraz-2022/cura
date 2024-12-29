import { Image, Pressable, View, Modal, Text } from "react-native";
import { useRef, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";

// Constants
import ImageBox from "./ImageBox";
import { imagePaths } from "@/constants/imagePaths";

// Import the CustomInput component
import CustomInput from "@/components/micro/CustomInput";
import { devURL } from "@/constants/urls";

export default function CameraComponent() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCapturedImage, setShowCapturedImage] = useState(false);
  const [showDropdownModal, setShowDropdownModal] = useState(false);

  // State for form inputs
  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [question3, setQuestion3] = useState("");
  const [questions, setQuestions] = useState({});

  const cameraRef = useRef<CameraView | null>(null);

  const handleCamera = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
    if (permission?.granted) {
      setIsCameraOn((prev) => !prev);
    }
  };

  if (!permission) {
    return <View />;
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo?.uri || null);
      console.log(photo?.uri || "no pic");

      if (photo?.uri) {
        try {
          const response = await fetch(`${devURL}/api/ai/image`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: photo.uri }),
          });

          if (response.ok) {
            const data = await response.json();
            setQuestions(data.questions);
            setQuestion1(data.questions.question1 || "");
            setQuestion2(data.questions.question2 || "");
            setQuestion3(data.questions.question3 || "");
            setShowDropdownModal(true);
          } else {
            console.error("Failed to fetch questions.");
          }
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      }
    }
  };

  const handleFormSubmit = async () => {
    try {
      const response = await fetch(`${devURL}/api/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: capturedImage,
          answers: {
            question1,
            question2,
            question3,
          },
        }),
      });

      if (response.ok) {
        console.log("Questions submitted successfully.");
        setShowDropdownModal(false);
        setIsCameraOn(false);
      } else {
        console.error("Failed to submit questions.");
      }
    } catch (error) {
      console.error("Error submitting questions:", error);
    }
  };

  return (
    <View>
      <Pressable onPress={handleCamera}>
        <Image source={imagePaths.camera_icon} className="w-7 h-7 mx-auto" />
        <Text className="text-primary-dark mt-2 text-xs">Upload Image</Text>
      </Pressable>
      {capturedImage && (
        <Pressable
          className="mt-4 mx-auto"
          onPress={() => setShowCapturedImage(true)}
        >
          <ImageBox height={40} width={40} uri imageUri={capturedImage} />
        </Pressable>
      )}

      {isCameraOn && (
        <Modal visible={isCameraOn} animationType="slide">
          <CameraView style={{ flex: 1 }} ref={cameraRef}>
            <View className="absolute bottom-16 left-0 flex flex-row items-center justify-between w-full px-10">
              <Pressable
                className="w-10 h-10 rounded-lg bg-lightBrown"
                onPress={() => setShowCapturedImage(true)}
              >
                <Image
                  source={
                    capturedImage ? { uri: capturedImage } : imagePaths.food
                  }
                  className="w-full h-full rounded-lg"
                />
              </Pressable>
              <Pressable
                className="w-16 h-16 rounded-full"
                onPress={takePicture}
              >
                <Image
                  source={imagePaths.camera_icon}
                  className="w-16 h-16 m-auto"
                />
              </Pressable>
              <Pressable
                className="w-10 h-10"
                onPress={() => setIsCameraOn(false)}
              >
                <Image
                  source={imagePaths.close_icon}
                  className="w-full h-full"
                />
              </Pressable>
            </View>
          </CameraView>
        </Modal>
      )}
      {capturedImage && showCapturedImage && (
        <Modal visible={showCapturedImage} animationType="slide">
          <View className="bg-darkBrown h-full w-full">
            <Pressable
              className="absolute left-0 top-0 z-20 my-16 mx-3"
              onPress={() => setShowCapturedImage(false)}
            >
              <Image source={imagePaths.back_icon} className="w-10 h-10" />
            </Pressable>
            <Image
              source={{ uri: capturedImage }}
              className="my-auto w-full h-1/2"
              style={{ resizeMode: "cover" }}
            />
          </View>
        </Modal>
      )}

      {/* Dropdown Modal with CustomInput for Questions */}
      {capturedImage && showDropdownModal && (
        <Modal visible={showDropdownModal} animationType="slide">
          <View className="bg-primary-dark h-full w-full p-5">
            <Text className="text-white text-lg mb-5">
              Please answer the following questions:
            </Text>
            <CustomInput
              label="Question 1"
              placeholder="Enter your answer"
              placeholderColor="gray"
              textColor="text-black"
              bgColor="bg-white"
              type="text"
              value={question1}
              onChange={setQuestion1}
              containerClass="mb-5"
            />
            <CustomInput
              label="Question 2"
              placeholder="Enter your answer"
              placeholderColor="gray"
              textColor="text-black"
              bgColor="bg-white"
              type="text"
              value={question2}
              onChange={setQuestion2}
              containerClass="mb-5"
            />
            <CustomInput
              label="Question 3"
              placeholder="Enter your answer"
              placeholderColor="gray"
              textColor="text-black"
              bgColor="bg-white"
              type="text"
              value={question3}
              onChange={setQuestion3}
              containerClass="mb-10"
            />
            <Pressable
              onPress={handleFormSubmit}
              className="bg-neutral-light py-3 rounded-md"
            >
              <Text className="text-neutral-default text-center font-bold">
                Submit
              </Text>
            </Pressable>
            <Pressable
              className="absolute top-0 right-0 m-3"
              onPress={() => setShowDropdownModal(false)}
            >
              <Image source={imagePaths.close_icon} className="w-5 h-5" />
            </Pressable>
          </View>
        </Modal>
      )}
    </View>
  );
}
