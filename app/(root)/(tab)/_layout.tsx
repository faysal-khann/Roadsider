import { Tabs } from "expo-router"
import { useColorScheme } from "react-native"
import { Ionicons } from '@expo/vector-icons'

export default function DashboardLayout() {


  return (

      <Tabs
      screenOptions={{
        headerShown: false,
       
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      }}
    >
      <Tabs.Screen 
        name="profile"
        options={{ 
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="index"
        options={{ 
          title: "index",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="search"
        options={{ 
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen
        name="saved"
        options={{ 
          title: "Saved",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark" size={size} color={color} />
          ),
        }} 
      />
    </Tabs>
    
    
  )
}