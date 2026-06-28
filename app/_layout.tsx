import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
const properties = [
  { id: "1", name: "Property 1" },
  { id: "2", name: "Property 2" },
  { id: "3", name: "Property 3" },
];
export default function RootLayout() {
  return (
    <SafeAreaView className="bg-white p-10">
      <View>
        <Text>Welcome to the app!</Text>
        <TextInput placeholder="Search City" placeholderTextColor="gray" />

        <TouchableOpacity
          onPress={() => {
            console.log("Button pressed!");
          }}
          style={{
            backgroundColor: "blue",
            padding: 12,
            borderRadius: 5,
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Click me!</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#f0f0f0",
              padding: 16,
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Text style={{ color: "blue" }}>Property ID: {item.id}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
