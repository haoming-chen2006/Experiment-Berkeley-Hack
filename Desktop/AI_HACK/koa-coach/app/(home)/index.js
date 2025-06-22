import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import { Video } from "expo-av";

import anim1 from "../animations/anime1.mp4";
import anim2 from "../animations/anime2.mp4";
import anim3 from "../animations/anime3.mp4";
import avatarImage from "../animations/koa.png";

export default function HomePage() {
  const { width, height } = useWindowDimensions();
  const avatarSize = Math.min(width, height) * 0.8;

  const [isAnimating, setAnimating] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const videoRef = useRef(null);
  const videoIndex = useRef(0);

  const animations = [anim1, anim2, anim3];

  const playNextAnimation = () => {
    const next = animations[videoIndex.current % animations.length];
    videoIndex.current = (videoIndex.current + 1) % animations.length;
    setCurrentVideo(next);
    setAnimating(true);
  };

  const handleClick = () => {
    if (!isAnimating) {
      playNextAnimation();
    }
  };

  const handleVideoEnd = () => {
    setAnimating(false);
    setCurrentVideo(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        <TouchableOpacity onPress={handleClick}>
          {isAnimating && currentVideo ? (
            <Video
              key={currentVideo}
              ref={videoRef}
              source={currentVideo}
              resizeMode="contain"
              shouldPlay
              onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish) handleVideoEnd();
              }}
              style={[styles.avatar, { width: avatarSize, height: avatarSize }]}
              isLooping={false}
            />
          ) : (
            <Image
              source={avatarImage}
              style={[styles.avatar, { width: avatarSize, height: avatarSize }]}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", justifyContent: "center" },
  avatarWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    overflow: "hidden",
  },
  avatar: {
    backgroundColor: "#000",
  },
});