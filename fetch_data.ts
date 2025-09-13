import fetch from 'node-fetch';
import * as fs from 'fs';
import { API_KEY, CHANNEL_ID } from './secrets';

interface Video {
  title: string;
  url: string;
}

async function fetchAllVideos(channelId: string, apiKey: string): Promise<Video[]> {
  let videos: Video[] = [];
  let nextPageToken = '';
  do {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50&type=video&pageToken=${nextPageToken}`;
    const res = await fetch(url);
    const data = await res.json() as any;
    if (data.items) {
      videos.push(...data.items.map((item: any) => ({
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      })));
    }
    nextPageToken = data.nextPageToken || '';
  } while (nextPageToken);
  return videos;
}

fetchAllVideos(CHANNEL_ID, API_KEY)
  .then(videos => {
    videos.forEach(v => console.log(`${v.title}: ${v.url}`));
    // Optionally, write to a file:
    fs.writeFileSync('videos.json', JSON.stringify(videos, null, 2));
  })
  .catch(console.error);
