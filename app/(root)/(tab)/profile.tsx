import { View, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/expo'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
export default function profile() {
  const router = useRouter();
  const { signOut } = useAuth();
  const handleSignOut = async () => {
    try{
    await signOut();
    router.replace('/sign-in');
    }catch(error){
      console.error('Error signing out:', error);
    }
   
  };
  return (
    <SafeAreaView>
      <Text>profile</Text>
      <TouchableOpacity onPress={handleSignOut}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}