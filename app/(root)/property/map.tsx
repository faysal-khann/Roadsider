import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
export default function MapScreen() {
  const { latitude, longitude, title, address } = useLocalSearchParams<{
    latitude: string;
    longitude: string;
    title: string;
    address: string;
  }>();

  const router = useRouter();

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    lng - 0.001
  }%2C${lat - 0.001}%2C${lng + 0.001}%2C${
    lat + 0.001
  }&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 py-4  border-b border-gray-100 ">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1  mx-3">
          <Text className="text-lg font-semibold text-gray-900">{title}</Text>
          <Text className="text-gray-500 ">{address}</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
            )
          }
          className="flex-row items-center  bg-blue-50 px-4 py-2 rounded-full"
        >

          <Ionicons name="navigate" size={17} color="#3B82F6" />
          <Text className="text-blue-600 font-semibold ml-2">Google Maps</Text>
        </TouchableOpacity>
      </View>
      <WebView 

        source={{ uri: mapUrl }}
        style={{ flex: 1 }}
        scrollEnabled={false}
        pointerEvents="none"
      
      />


    </SafeAreaView>
  );
}
