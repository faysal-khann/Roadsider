import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/userStore";
import { Property } from "@/types";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

import { useSavedProperty } from "@/hooks/useSavedProperty";
import { formatPrice } from "@/lib/utils";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const router = useRouter();
  const isAdmin = useUserStore((state) => state.isAdmin);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  const authSupabase = useSupabase();

  const { isSaved, saveLoading, toggleSave } = useSavedProperty(id ?? "");

  const fetchProperty = async () => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();
    setProperty(data);
    setLoading(false);
  };
  useEffect(() => {
    fetchProperty();
  }, [id]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  if (!property) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Property not found</Text>
      </View>
    );
  }
//   const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
//     property.longitude - 0.003
//   }%2C${property.latitude - 0.003}%2C${property.longitude + 0.003}%2C${
//     property.latitude + 0.003
//   }&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`;

  const isLongDesc = (property.description.length ?? 0) > 150;
  const displayDesc =
    expanded || !isLongDesc
      ? property.description
      : property.description.slice(0, 150) + "...";

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View>
          <View style={{ opacity: property.is_sold ? 0.5 : 1 }}>
            <FlatList
              data={property.images}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setImageViewerVisible(true)}>
                  <Image
                    source={{ uri: item }}
                    style={{ width, height: 300 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={onScroll}
            />
          </View>
          {/* Image count badge */}
          <View className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded-full px-2 py-1">
            <Text className="text-white text-sm">
              {activeIndex + 1} / {property.images.length}
            </Text>
          </View>
          <SafeAreaView className="absolute top-0 left-0 right-0 ">
            <View className="flex-row items-center justify-between px-4 py-3">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 bg-white rounded-full items-center justify-center "
                style={{
                  elevation: 3,
                }}
              >
                <Ionicons name="arrow-back" size={24} color="#111827" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleSave}
                disabled={saveLoading}
                className="w-10 h-10 bg-white rounded-full items-center justify-center "
                style={{
                  elevation: 3,
                }}
              >
                <Ionicons
                  name={isSaved ? "heart" : "heart-outline"}
                  size={24}
                  color={isSaved ? "#EF4444" : "#111827"}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
        <View
          className="px-5 py-4"
          style={{
            opacity: property.is_sold ? 0.5 : 1,
          }}
        >
          <View className="flex-row flex-wrap gap-2 mb-3">
            <View className="bg-blue-100 px-3 py-1 rounded-full">
              <Text className="text-blue-800 text-sm font-medium capitalize">
                {property.type}
              </Text>
            </View>
            {property.is_featured && (
              <View className="bg-yellow-100 px-3 py-1 rounded-full">
                <Text className="text-yellow-800 text-sm font-medium">
                  Featured
                </Text>
              </View>
            )}
            {property.is_sold && (
              <View className="bg-red-100 px-3 py-1 rounded-full">
                <Text className="text-red-800 text-sm font-medium">Sold</Text>
              </View>
            )}
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {property.title}
          </Text>

          <Text className="text-xl font-bold text-blue-600 mb-4">
            {formatPrice(property.price)}
          </Text>

          <View className="flex-row items-center justify-between rounded-2xl bg-gray-50 pb-4 mb-5">
            <SpecItem
              icon="bed-outline"
              label="Bedrooms"
              value={property.bedrooms}
            />
            <SpecItem
              icon="water-outline"
              label="Bathrooms"
              value={property.bathrooms}
            />
            <SpecItem
              icon="expand-outline"
              label="Area"
              value={`${property.area_sqft} sq ft`}
            />
            <SpecItem icon="home-outline" label="Type" value={property.type} />
          </View>
          <Text className="text-base font-bold text-gray-900 mb-2">
            Description
          </Text>
          <Text className="text-sm text-gray-600 mb-2">{displayDesc}</Text>
          {isLongDesc && (
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
              <Text className="text-sm text-blue-600 font-semibold">
                {expanded ? "Read less" : "Read more"}
              </Text>
            </TouchableOpacity>
          )}

          <Text className="text-base font-bold text-gray-900 mb-2 mt-5">
            Location
          </Text>
          <View className="flex-row items-center gap-2 mb-4 ">
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text className="text-sm text-gray-600">
              {property.address}, {property.city}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            className="rounded-2xl overflow-hidden mb-6"
            style={{ height: 200 }}
          >
            {/* <WebView
              source={{ uri: mapUrl }}
              style={{ flex: 1 }}
              scrollEnabled={false}
              pointerEvents="none"
            /> */}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function SpecItem({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
}) {
  return (
    <View className=" items-center gap-2">
      <Ionicons name={icon} size={20} color="#2563EB" />
      <Text className="text-sm text-gray-600 font-bold">{value}</Text>
      <Text className="text-xs text-gray-400">{label}</Text>
    </View>
  );
}
