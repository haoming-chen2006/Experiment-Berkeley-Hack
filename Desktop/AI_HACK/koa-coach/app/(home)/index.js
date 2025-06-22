import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Video from "react-native-video";
import anim1 from "../animations/anime1.mp4";
import OriginalHome from "./original";

export default function HomeIndex() {
  const [showHome, setShowHome] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowHome(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (showHome) {
    return <OriginalHome />;
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={() => setShowHome(true)}
    >
      <Video
        source={anim1}
        resizeMode="contain"
        repeat={false}
        paused={false}
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
