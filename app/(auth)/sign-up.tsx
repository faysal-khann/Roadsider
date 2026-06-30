import { useAuth, useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();

  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";
  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  const onVerifyPress = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  const onSignUpPress = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });
    if (error) {
      alert(error.message);
    }
    if (!error) await signUp.verifications.sendEmailCode();
  };

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../assets/images/kribb.png")}
          className="w-32 h-16 mb-8"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Verify your email address
        </Text>
        <Text className="text-gray-500 mb-8">
          We have sent a verification code to your email {email}.
        </Text>

        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
          placeholder="Enter verification code"
          placeholderTextColor="#9CA3AF"
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
        />

        {errors.fields.code && (
          <Text className="text-red-500 mb-2">
            {errors.fields.code.message}
          </Text>
        )}
        <TouchableOpacity
          onPress={onVerifyPress}
          disabled={isLoading}
          className="bg-blue-500 rounded-xl items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color="white" className="py-3" />
          ) : (
            <Text className="text-white py-3">Verify Code</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signUp.verifications.sendEmailCode()}

          className="py-3"
        >
          <Text className="text-blue-500 font-semibold text-center">
            Resend Verification Code
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../assets/images/kribb.png")}
          className="w-32 h-16 mb-8"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Create Account
        </Text>
        <Text className="text-gray-500 mb-8">Find our Dream home today</Text>

        <View className="flex-row gap-3 mb-4">
          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            placeholder="First name"
            placeholderTextColor="#9CA3AF"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />
          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            placeholder="Last name"
            placeholderTextColor="#9CA3AF"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
        </View>

        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"

          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.fields.emailAddress && (
          <Text className="text-red-500 mb-2">
            {errors.fields.emailAddress.message}
          </Text>
        )}
        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6"
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.fields.password && (
          <Text className="text-red-500 mb-2">
            {errors.fields.password.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={onSignUpPress}
          disabled={isLoading}
          className="bg-blue-500 rounded-xl items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color="white" className="py-3" />
          ) : (
            <Text className="text-white py-3">Sign Up</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-500">Already have an account? </Text>
          <Link href="/sign-in" className="text-blue-500 font-semibold">
            Sign In
          </Link>
        </View>

        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
}
