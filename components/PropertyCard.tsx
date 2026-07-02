import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function PropertyCard({
  property,
  onUnsave,
  showSave,
}: {
  property: Property;
  onUnsave: () => void;
  showSave: boolean;
}) {
  const router = useRouter();
  //   const is_sold=true;
  return (
    <TouchableOpacity
      className="flex-row bg-white rounded-2xl overflow-hidden mb-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        opacity: property.is_sold ? 0.5 : 1,
      }}

      onPress={() => router.push(`./(root)/property/${property.id}`)}
    >
      <Image
        source={{ uri: property.images[0] }}
        className="w-28 h-28 "
        resizeMode="cover"
      />

      <View className="flex-1 p-3 justify-between">
        <View>
          <Text className="text-base font-semibold text-gray-900 mb-1">
            {property.title}
          </Text>
          <View className="flex-row items-center gap-1">
            <Ionicons name="location" size={16} color="#6B7280" />
            <Text className="text-xs text-gray-600">
              {property.address}, {property.city}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between ">
          <Text className="text-sm font-bold text-blue-600">
            {formatPrice(property.price)}
          </Text>

          {!property.is_sold && (
            <View className="bg-red-50 px-2 py-0.5 rounded-full">
              <Text className=" text-red-500 text-xs font-semibold ">Sold</Text>
            </View>
          )}
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="bed-outline" size={13} color="#6B7280" />
              <Text className="text-xs text-gray-500">{property.bedrooms}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="water-outline" size={13} color="#6B7280" />
              <Text className="text-xs text-gray-500">
                {property.bathrooms}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity className="w-10 items-center pt-3">
        <Ionicons 
        name={showSave ? "heart" : "heart-outline"}
        size={20}
        color={showSave ? "#EF4444" : "#6B7280"}
        onPress={onUnsave}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
