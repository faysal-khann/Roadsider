import { PropertyType, useFilterStore } from "@/store/filterStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TYPES: { label: string; value: PropertyType }[] = [
  { label: "All", value: null },
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Villa", value: "villa" },
  { label: "Studio", value: "studio" },
];

const BEDS = [
  { label: "Any", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4+", value: 4 },
];

const PRICE_PRESETS = [
  { label: "Under $500K", min: null, max: 500_000 },
  { label: "$500K - $1M", min: 500_000, max: 1_000_000 },
  { label: "$1M - $2M", min: 1_000_000, max: 2_000_000 },
  { label: "Above $2M", min: 2_000_000, max: null },
];

const chip = (active: boolean) =>
  `px-4 py-2 rounded-full border ${
    active ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"
  }`;

const chipText = (active: boolean) =>
  `text-sm font-semibold ${active ? "text-white" : "text-gray-600"}`;

export default function FilterModel({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const {
    search,
    type,
    bedrooms,
    minPrice,
    maxPrice,
    setSearch,
    setType,
    setBedrooms,
    setMinPrice,
    setMaxPrice,
    resetFilters,
  } = useFilterStore();

  const [localMin, setLocalMin] = useState(minPrice ? String(minPrice) : "");
  const [localMax, setLocalMax] = useState(maxPrice ? String(maxPrice) : "");

  const activeCount = [
    type !== null,
    bedrooms !== null,
    minPrice !== null,
    maxPrice !== null,
  ].filter(Boolean).length;

  const handleApply = () => {
    setMinPrice(localMin ? Number(localMin) : null);
    setMaxPrice(localMax ? Number(localMax) : null);
    onClose();
  };

  const handleReset = () => {
    setLocalMin("");
    setLocalMax("");
    resetFilters();
    onClose();
  };

  const shadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      // transparent
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-gray-50 pt-10 ">
        <View className="flex-row items-center justify-between px-5 pt-6 pb-4 bg-white border-b border-gray-100">
          <TouchableOpacity onPress={onClose} className="p-1">
            <Ionicons name="close" size={22} color="#374151" />
          </TouchableOpacity>

          <Text className="text-lg font-semibold text-gray-900">Filters</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text className="text-sm font-semibold text-blue-600">Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-5 pt-6"
          contentContainerStyle={{ paddingBottom: 40, padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-base font-semibold text-gray-800 mb-3">
            Property Type
          </Text>
          <View className="flex-row flex-wrap gap-3 mb-6">
            {TYPES.map((item) => (
              <TouchableOpacity
                key={String(item.value)}
                onPress={() => setType(item.value)}
                className={chip(type === item.value)}
                style={shadow}
              >
                <Text className={chipText(type === item.value)}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-base font-semibold text-gray-800 mb-3">
            Bedrooms
          </Text>
          <View className="flex-row flex-wrap gap-3 mb-6">
            {BEDS.map((item) => (
              <TouchableOpacity
                key={String(item.value)}
                onPress={() => setBedrooms(item.value)}

                className={`flex-1 items-center justify-center py-3 rounded-2xl border ${chip(bedrooms === item.value)}`}
                style={shadow}
              >
                <Text
                  className={`text-sm font-bold ${chipText(bedrooms === item.value)}`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-base font-semibold text-gray-800 mb-3">
            Price Range
          </Text>

          <View className="flex-row  gap-3 mb-3">
            {[
              {
                label: "Min Price",
                value: localMin,
                onChange: setLocalMin,
                placeholder: "0",
              },
              {
                label: "Max Price",
                value: localMax,
                onChange: setLocalMax,
                placeholder: "any",
              },
            ].map(({ label, value, onChange, placeholder }) => (
              <View key={label} className="flex-1">
                <Text className="text-sm text-gray-600 mb-1.5 font-medium">
                  {label}
                </Text>
                <View
                  className="flex-row items-center  bg-white rounded-2xl px-3 border border-gray-200"
                  style={shadow}
                >
                  <Text className="text-gray-600 text-sm">$</Text>
                  <TextInput
                    className="flex-1 py-3 text-gray-800 text-sm "
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            ))}
          </View>

          <View className="flex-row flex-wrap gap-3 mb-6">
            {PRICE_PRESETS.map((item) => {
              const active = minPrice === item.min && maxPrice === item.max;

              return (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => {
                    setLocalMin(item.min ? String(item.min) : "");
                    setLocalMax(item.max ? String(item.max) : "");
                    setMinPrice(item.min);
                    setMaxPrice(item.max);
                  }}

                  className={`px-3 py-1.5 rounded-full border ${
                    active
                      ? "bg-blue-50 border-blue-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      active ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View className="px-5 pb-8 pt-4  border-t  border-gray-200 bg-white rounded-t-3xl mb-2">
          <TouchableOpacity
            onPress={handleApply}
            className={`w-full py-3 rounded-2xl items-center justify-center ${
              activeCount > 0 ? "bg-blue-600" : "bg-gray-300"
            }`}
            style={{
              shadowColor: "#2563EB",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-white font-bold text-base">
              Apply Filter {activeCount > 0 && `(${activeCount})`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
