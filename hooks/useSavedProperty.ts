import { useAuth } from "@clerk/expo";
import { useEffect, useState } from "react";
import { useSupabase } from "./useSupabase";

export function useSavedProperty(propertyId: string, onUnsave?: () => void) {
  const { userId } = useAuth();
  const authSupabase = useSupabase();

  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const checkIfSaved = async () => {
    if (!userId) return;
    const { data, error } = await authSupabase
      .from("saved_properties")
      .select("*")
      .eq("user_clerk_id", userId)
      .eq("property_id", propertyId)
      .single();
    setIsSaved(!!data);
  };

  useEffect(() => {
    checkIfSaved();
  }, [propertyId, userId]);

  const toggleSave = async () => {
    if (!userId || saveLoading) return;
    setSaveLoading(true);

    if (isSaved) {
      const { error } = await authSupabase
        .from("saved_properties")
        .delete()
        .eq("user_clerk_id", userId)
        .eq("property_id", propertyId);
      if (!error) {
        setIsSaved(false);
        onUnsave?.();
      }
    } else {
      const { error } = await authSupabase
        .from("saved_properties")
        .insert([{ user_clerk_id: userId, property_id: propertyId }]);
      if (!error) {
        setIsSaved(true);
      }
    }
    setSaveLoading(false);
  };
  return { isSaved, toggleSave, saveLoading };
}
