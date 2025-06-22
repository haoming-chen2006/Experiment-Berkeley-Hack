export function loadAnimeAnimations() {
  return [
    require("../anime/anime1.mp4"),
    require("../anime/anime2.mp4"),
    require("../anime/anime3.mp4"),
    require("../anime/anime4.mp4"),
    require("../anime/anime5.mp4"),
    require("../anime/anime6.mp4"),
  ];
}

export function loadActionAnimations() {
  return [
    require("../animations/action1.mp4"),
    require("../animations/action2.mp4"),
    require("../animations/action3.mp4"),
    require("../animations/action4.mp4"),
    require("../animations/action5.mp4"),
  ];
}

// Backwards compatibility with older imports
export const loadAnimations = loadAnimeAnimations;
