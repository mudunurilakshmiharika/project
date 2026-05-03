const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  { name: 'white_shirt.jpg', url: 'https://images.unsplash.com/photo-1620012253575-4b7c7f8dfcb3?q=80&w=1000&auto=format&fit=crop' },
  { name: 'bomber_jacket.jpg', url: 'https://images.unsplash.com/photo-1591047134402-234122d1feaa?q=80&w=1000&auto=format&fit=crop' },
  { name: 'chelsea_boots.jpg', url: 'https://images.unsplash.com/photo-1635397174447-508829427341?q=80&w=1000&auto=format&fit=crop' },
  { name: 'wool_coat.jpg', url: 'https://images.unsplash.com/photo-1539533377285-3c12ee3c5415?q=80&w=1000&auto=format&fit=crop' }
];

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
};

async function run() {
  const dir = path.join('frontend', 'assets', 'images');
  for (const img of images) {
    const dest = path.join(dir, img.name);
    console.log(`Downloading ${img.name}...`);
    try {
      await download(img.url, dest);
      console.log(`Successfully downloaded ${img.name}`);
    } catch (err) {
      console.error(`Error downloading ${img.name}:`, err.message);
    }
  }
}

run();
