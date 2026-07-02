import { Tabs } from "expo-router"
import { useColorScheme } from "react-native"
import { Ionicons } from '@expo/vector-icons'
import { useUserStore } from "@/store/userStore"
export default function DashboardLayout() {
  const isAdmin =useUserStore((state) => state.isAdmin)

  return (

      <Tabs
      screenOptions={{
        headerShown: false,
       
        
      }}
    >
      <Tabs.Screen 
        name="index"
        options={{ 
          title: "home",
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
      {isAdmin && (
        <Tabs.Screen 
          name="create"
          options={{ 
            title: "Create",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" size={size} color={color} />
            ),
          }} 
        />
      )}
      <Tabs.Screen
        name="saved"
        options={{ 
          title: "Saved",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="profile"
        options={{ 
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }} 
      />
      
      
      
    </Tabs>
    
    
  )
}