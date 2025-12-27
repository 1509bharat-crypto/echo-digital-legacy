const fs = require('fs');
const path = require('path');

// Read the image paths from the TypeScript file
const imagePathsContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'imagePaths.ts'), 'utf8');
const IMAGE_PATHS = JSON.parse(imagePathsContent.match(/export const IMAGE_PATHS = \n(\[[\s\S]*?\])/)[1].replace(/"/g, '"'));

// Metadata templates based on folder categories
const metadataTemplates = {
  'family frames 4x': [
    { location: 'Home, California', dates: ['Dec 2023', 'Nov 2023', 'Oct 2022', 'Jan 2024'] },
    { location: 'Grandma\'s House, Ohio', dates: ['Dec 2022', 'Jul 2023'] },
    { location: 'Lake Tahoe, CA', dates: ['Aug 2023', 'Jul 2022'] },
    { location: 'Boston, MA', dates: ['May 2023', 'Nov 2022'] },
  ],
  'travel export 4x': [
    { location: 'Paris, France', dates: ['Jun 2023', 'May 2023'] },
    { location: 'Tokyo, Japan', dates: ['Mar 2024', 'Apr 2024'] },
    { location: 'Barcelona, Spain', dates: ['Aug 2023'] },
    { location: 'Santorini, Greece', dates: ['Aug 2022', 'Sep 2022'] },
    { location: 'Kyoto, Japan', dates: ['Apr 2024'] },
    { location: 'Iceland', dates: ['Jul 2022'] },
    { location: 'Bali, Indonesia', dates: ['Feb 2024'] },
    { location: 'Amsterdam, Netherlands', dates: ['Apr 2023'] },
    { location: 'Prague, Czech Republic', dates: ['Sep 2023'] },
    { location: 'Venice, Italy', dates: ['Jul 2023'] },
    { location: 'Rome, Italy', dates: ['May 2023'] },
  ],
  'food frames': [
    { location: 'San Francisco, CA', dates: ['Jan 2024', 'Dec 2023', 'Nov 2023'] },
    { location: 'New York, NY', dates: ['Sep 2022', 'Oct 2023'] },
    { location: 'Portland, OR', dates: ['Jun 2023'] },
    { location: 'Los Angeles, CA', dates: ['Jun 2022', 'Aug 2023'] },
    { location: 'Seattle, WA', dates: ['May 2023'] },
  ],
  'friends export 4x': [
    { location: 'Brooklyn, NY', dates: ['Sep 2022', 'Oct 2022'] },
    { location: 'Austin, TX', dates: ['Mar 2023'] },
    { location: 'Denver, CO', dates: ['Jan 2023'] },
    { location: 'Chicago, IL', dates: ['Nov 2022'] },
    { location: 'Miami, FL', dates: ['Feb 2023'] },
  ],
  'work export': [
    { location: 'San Francisco, CA', dates: ['Jan 2024', 'Feb 2024', 'Dec 2023', 'Nov 2023'] },
    { location: 'New York, NY', dates: ['Sep 2023', 'Oct 2023'] },
    { location: 'London, UK', dates: ['Dec 2023'] },
    { location: 'Singapore', dates: ['Oct 2023'] },
  ],
  'us frames 4x': [
    { location: 'San Diego, CA', dates: ['Jul 2023', 'Aug 2022'] },
    { location: 'Napa Valley, CA', dates: ['Sep 2023'] },
    { location: 'Big Sur, CA', dates: ['Jun 2022'] },
    { location: 'Yosemite, CA', dates: ['Oct 2022'] },
    { location: 'Santa Barbara, CA', dates: ['May 2023'] },
  ],
};

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateMetadata() {
  const metadata = {};

  IMAGE_PATHS.forEach(imagePath => {
    // Determine category from path
    let category = null;
    for (const key in metadataTemplates) {
      if (imagePath.includes(key)) {
        category = key;
        break;
      }
    }

    if (category) {
      const templates = metadataTemplates[category];
      const template = getRandomItem(templates);
      const date = getRandomItem(template.dates);

      metadata[imagePath] = {
        location: template.location,
        date: date
      };
    }
  });

  return metadata;
}

const metadata = generateMetadata();

// Write to JSON file
const outputPath = path.join(__dirname, '..', 'src', 'lib', 'imageMetadata.json');
fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));

console.log(`Generated metadata for ${Object.keys(metadata).length} images`);
console.log(`Metadata saved to: ${outputPath}`);
