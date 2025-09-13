"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// Load videos from videos.json
var videos = JSON.parse(fs.readFileSync('data/videos.json', 'utf-8'));
// Set the start date for the daily game to today
var START_DATE = new Date();
START_DATE.setHours(0, 0, 0, 0); // Normalize to midnight
// Seeded random shuffle (Fisher-Yates)
function seededRandom(seed) {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}
function shuffle(array, seed) {
    var _a;
    var arr = array.slice();
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(seededRandom(seed + i) * (i + 1));
        _a = [arr[j], arr[i]], arr[i] = _a[0], arr[j] = _a[1];
    }
    return arr;
}
// Set your seed value here for reproducibility
var SEED = 69; // Change this value for different shuffles
var shuffledVideos = shuffle(videos, SEED);
var assignments = [];
for (var i = 0; i < shuffledVideos.length; i++) {
    var date = new Date(START_DATE);
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
