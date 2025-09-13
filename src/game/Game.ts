// List of common words to ignore in title/guess comparison
const COMMON_WORDS = [
  'cover', 'by', 'ost', 'anuc', 'the', 'a', 'and', 'for', 'on', 'in', 'of', 'to', 'with', 'at', 'from', 'as', 'is', 'has', 'been', 'due', 'you', 'my', 'me', 'we', 'are', 'how', 'did', 'can', 'like', 'up', 'little', 'years', 'attack', 'titan', 'removed', 'copyright', 'issues', 'anucatittawan', 'อนัค', 'อนัค', 'จงรัก', 'ใจรัก', 'บุพเพสันนิวาส'
];

// Remove punctuation, convert to lowercase, and filter out common words
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[.,*\-–—_!?:;"'`~()\[\]{}|\\/]/g, ' ')
    .split(/\s+/)
    .filter(word => word && !COMMON_WORDS.includes(word))
    .join(' ');
}

// Vite special import for raw JSON
import dailyVideosRaw from '../../data/daily_videos.json?raw';

type Video = {
  date: string;
  title: string;
  url: string;
};

export class Game {
  private dailyVideos: Video[] = [];
  private currentVideo: Video | null = null;

  constructor() {
    // Parse JSON into JS objects
    this.dailyVideos = JSON.parse(dailyVideosRaw);
  }

  // Get today's video based on current date (YYYY-MM-DD)
  getTodaysVideo(): Video | null {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    return this.dailyVideos.find(v => v.date === todayStr) || null;
  }

  start(): string {
    this.currentVideo = this.getTodaysVideo();
    if (!this.currentVideo) return '';
    // Extract video ID from the URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
    const match = this.currentVideo.url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : '';
  }

  checkGuess(guess: string): boolean {
    if (!this.currentVideo) return false;
    const normGuess = normalize(guess.trim());
    const normTitle = normalize(this.currentVideo.title);
    return normGuess === normTitle;
  }

  getAnswer(): string {
    return this.currentVideo ? this.currentVideo.title : '';
  }
}
