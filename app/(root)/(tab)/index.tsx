import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { useUser } from "@clerk/expo";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
// import { FlatList } from "react-native-reanimated/lib/typescript/Animated";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FeaturedCard from "@/components/FeaturedCard";
import PropertyCard from "@/components/PropertyCard";
const index = () => {
  const { user } = useUser();
  const router = useRouter();

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // console.log(featured, recommended);
  // console.log('featured data:', featured);

  const fetchProperties = async () => {
    setLoading(true);
    const { data: featuredData } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    const { data: recommendedData } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", false)
      .order("created_at", { ascending: false });

    setFeatured(featuredData ?? []);
    setRecommended(recommendedData ?? []);
    setLoading(false);
  };
  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, []),
  );
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header */}

            <View className="flex-row items-center justify-between px-5 pt-4 pb-5 bg-white shadow">
              <Image
                source={require("../../../assets/images/kribb.png")}
                style={{ width: 90, height: 36, resizeMode: "contain" }}
              />

              <View className="item-end">
                <Text>Good Morning</Text>

                <Text className="text-base font-bold text-gray-900">
                  {user?.firstName ?? "User"}
                </Text>
              </View>
            </View>

            {/* Search bar */}
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tab)/search")}
              className="flex-row items-center bg-white mx-4 rounded-2xl mx-5 my-3 px-4 py-3 gap-2 shadow"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Ionicons name="search" size={18} color="#9CA3AF" />
              <Text className="ml-2 text-gray-400">Search properties...</Text>
              <TouchableOpacity
                onPress={() =>
                  router.push("/(root)/(tab)/search?openFilter=true")
                }
                className="w-8 h-8  bg-blue-500 items-center rounded-xl justify-center ml-auto"
              >
                <Ionicons name="options-outline" size={18} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Featured Properties */}
            <View className="mb-5">
              <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
                Featured
              </Text>

              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#2563EB"
                  className="py-10"
                />
              ) : (
                <FlatList
                  data={featured}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <FeaturedCard property={item} />}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                />
              )}
            </View>

            {/* Recommended Header */}
            <Text className="text-gray-900 text-lg font-bold  px-4 mb-4">
              Recommended Properties
            </Text>

          </View>
        }
        renderItem={({ item }) => (
          <View className="px-4">
            <PropertyCard property={item} onUnsave={() => {}} showSave={false} />
          </View>
        )}

        ListEmptyComponent={
          !loading ? (
            <View className="py-10 items-center ">
              <Text className="text-gray-400 ">No properties found</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default index;
