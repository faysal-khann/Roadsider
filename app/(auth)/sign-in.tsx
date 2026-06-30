import { useSignIn } from "@clerk/expo";
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

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";
  const [showPassword, setShowPassword] = useState(false);

  const onVerifyPress = async () => {
    await signIn.mfa.verifyEmailCode({
      code,
    });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log("Current Task:", session?.currentTask);
            return;
          }

          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });
    if (error) {
      alert(error.message);
      return;
        
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log("Current Task:", session?.currentTask);
            return;
          }

          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.log("Sign-in attempt failed with status:", signIn);
    }
  };

  if (signIn.status === "needs_client_trust") {
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
          onPress={() => signIn.mfa.sendEmailCode()}

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
          Welcome to Kribb
        </Text>
        <Text className="text-gray-500 mb-8">Sign in to your account</Text>

        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"

          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.fields.identifier && (
          <Text className="text-red-500 mb-2">
            {errors.fields.identifier.message}
          </Text>
        )}
        <View className="w-full flex-row items-center border border-gray-300 rounded-xl px-4 mb-6">
          <TextInput
            className="flex-1 py-3"
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            // If showPassword is true, secureTextEntry becomes false (revealing the text)
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="current-password"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text className="text-blue-500 font-semibold">
              {showPassword ? "Hide" : "Show"}
            </Text>
            {/* Alternatively, use an icon: 
    <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#9CA3AF" /> 
    */}
          </TouchableOpacity>
        </View>
        {errors.fields.password && (
          <Text className="text-red-500 mb-2">
            {errors.fields.password.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={onSignInPress}
          disabled={isLoading}
          className="bg-blue-500 rounded-xl items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color="white" className="py-3" />
          ) : (
            <Text className="text-white py-3">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
           <Text className="text-gray-500">{"Don't have an account? "}</Text>

          <Link href="/sign-up" className="text-blue-500 font-semibold">
            Sign Up
          </Link>
        </View>

        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
}
