import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Video } from "expo-av";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import anim1 from "./animations/anime1.mp4";

export default function SplashScreen() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(handleEnd, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnd = async () => {
    if (redirecting) return;
    setRedirecting(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      router.replace("/(home)");
    } else {
      router.replace("/(auth)");
    }
  };

  if (redirecting) {
    return <View style={styles.container} />;
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={handleEnd}
    >
      <Video
        source={anim1}
        resizeMode="contain"
        isLooping={false}
        shouldPlay
        style={styles.video}
      />
      <Text style={styles.skipText}>Tap to skip</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "80%",
    height: "80%",
  },
  skipText: {
    position: "absolute",
    bottom: 30,
    color: "#fff",
    fontSize: 16,
  },
});
