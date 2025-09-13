import * as fs from 'fs';

// Load videos from videos.json
const videos: { title: string; url: string }[] = JSON.parse(fs.readFileSync('data/videos.json', 'utf-8'));

// Set the start date for the daily game to today
const START_DATE = new Date();
START_DATE.setHours(0, 0, 0, 0); // Normalize to midnight


// Seeded random shuffle (Fisher-Yates)
function seededRandom(seed: number) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function shuffle<T>(array: T[], seed: number): T[] {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Set your seed value here for reproducibility
const SEED = 69; // Change this value for different shuffles

const shuffledVideos = shuffle(videos, SEED);

const assignments: { date: string; title: string; url: string }[] = [];
for (let i = 0; i < shuffledVideos.length; i++) {
  const date = new Date(START_DATE);
  date.setDate(date.getDate() + i);
  assignments.push({
    date: date.toISOString().slice(0, 10),
    title: shuffledVideos[i].title,
    url: shuffledVideos[i].url,
  });
}

// Write the assignments to a new file
fs.writeFileSync('data/daily_videos.json', JSON.stringify(assignments, null, 2));

console.log('Assigned each video to a date in daily_videos.json');
