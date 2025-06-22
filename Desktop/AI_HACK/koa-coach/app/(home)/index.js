import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Text,
} from "react-native";
import Video from "react-native-video";

import anim1 from "../animations/anime1.mp4";
import anim2 from "../animations/anime2.mp4";
import anim3 from "../animations/anime3.mp4";
import anim4 from "../animations/anime4.mp4";
import anim5 from "../animations/anime5.mp4";
import anim6 from "../animations/anime6.mp4";
import avatarImage from "../animations/koa.png";

export default function HomePage() {
  const { width, height } = useWindowDimensions();
  const avatarSize = Math.min(width, height) * 0.7;

  const [isAnimating, setAnimating] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const videoIndex = useRef(0);
  const videoRef = useRef(null);

  const animations = [anim1, anim2, anim3, anim4, anim5, anim6];

  const playNextAnimation = () => {
    const next = animations[videoIndex.current % animations.length];
    videoIndex.current = (videoIndex.current + 1) % animations.length;
    setCurrentVideo(next);
    setAnimating(true);
  };

  const handleClick = () => {
    if (isAnimating) {
      setAnimating(false);
      setCurrentVideo(null);
    } else {
      playNextAnimation();
    }
  };

  const handleVideoEnd = () => {
    setAnimating(false);
    setCurrentVideo(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>position for top bar</Text>
      </View>
      <View style={[styles.avatarWrapper, { width: avatarSize, height: avatarSize }]}>
        <TouchableOpacity onPress={handleClick}>
          {isAnimating && currentVideo ? (
            <Video
              key={currentVideo}
              ref={videoRef}
              source={currentVideo}
              resizeMode="contain"
              repeat={false}
              paused={false}
              onEnd={handleVideoEnd}
              style={[styles.avatar, { width: avatarSize, height: avatarSize }]}
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
  topBar: {
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
  },
  topBarText: { color: "#fff" },
  avatarWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  avatar: {
    backgroundColor: "#000",
  },
});

