import { View, Text, FlatList } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUser } from '@clerk/expo'
import { useRouter } from 'expo-router'

const index = () => {

  const {user}= useUser()
  const router= useRouter()

  const [featured,setFeatured]= useState([])
  const [recommended,setRecommended]= useState([])
  const [loading,setLoading]= useState(true)
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      

    </SafeAreaView>
  )
}

export default index