import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      <Video source={anim1} resizeMode="contain" repeat={false} style={styles.video} />
    </View>
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
});
