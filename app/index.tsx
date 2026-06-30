import { Redirect } from "expo-router";
import { useAuth } from "@clerk/expo";

export default function Index() {
   const { isSignedIn, isLoaded } = useAuth(); // Capital 'L'

   if (!isLoaded) {
      return null;
   }
   if (isSignedIn) {
    return <Redirect href="/(root)/(tab)" />
   }
  return  <Redirect href="/sign-up" />
  
}
