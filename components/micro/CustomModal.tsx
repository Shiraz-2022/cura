import React from "react";
import { Modal, View, Text, TouchableWithoutFeedback } from "react-native";

interface CustomModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export default function CustomModal({
  visible,
  message,
  onClose,
}: CustomModalProps) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          className="
            flex-1 justify-center items-center bg-black bg-opacity-50"
        >
          <TouchableWithoutFeedback>
            <View className="w-4/5 bg-white p-6 rounded-lg shadow-lg">
              <Text className="text-center text-gray-800 text-base">
                {message}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
