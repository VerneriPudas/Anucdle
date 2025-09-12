import YAML from "yaml";
import videosYaml from "../../data/videos.yaml?raw"; // Vite special import

type Video = {
  id: string;
  title: string;
};

export class Game {
  private videos: Video[] = [];
  private currentVideo: Video | null = null;

  constructor() {
    // Parse YAML into JS objects
    const parsed = YAML.parse(videosYaml);
    this.videos = parsed.videos;
  }

  start(): string {
    this.currentVideo = this.videos[Math.floor(Math.random() * this.videos.length)];
    return this.currentVideo.id;
  }

  checkGuess(guess: string): boolean {
    if (!this.currentVideo) return false;
    return guess.trim().toLowerCase() === this.currentVideo.title.toLowerCase();
  }

  getAnswer(): string {
    return this.currentVideo ? this.currentVideo.title : "";
  }
}
