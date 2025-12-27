const ExifReader = require('exifreader');
const fs = require('fs');
const path = require('path');

// Read the image paths from the TypeScript file
const imagePathsContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'imagePaths.ts'), 'utf8');
const IMAGE_PATHS = JSON.parse(imagePathsContent.match(/export const IMAGE_PATHS = \n(\[[\s\S]*?\])/)[1].replace(/"/g, '"'));

async function extractMetadata() {
  const metadata = {};

  for (const imagePath of IMAGE_PATHS) {
    const fullPath = path.join(__dirname, '..', 'public', imagePath.replace(/^\//, ''));

    try {
      const tags = await ExifReader.load(fullPath, { expanded: true });

      // Extract GPS coordinates if available
      let location = null;
      if (tags.gps && tags.gps.Latitude && tags.gps.Longitude) {
        const lat = tags.gps.Latitude;
        const lon = tags.gps.Longitude;
        location = { lat, lon };
      }

      // Extract date if available
      let date = null;
      if (tags.exif && tags.exif.DateTimeOriginal) {
        const dateStr = tags.exif.DateTimeOriginal.description;
        // Parse EXIF date format (YYYY:MM:DD HH:MM:SS)
        const parts = dateStr.split(' ')[0].split(':');
        if (parts.length === 3) {
          const year = parts[0];
          const month = parseInt(parts[1]);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          date = `${monthNames[month - 1]} ${year}`;
        }
      }

      if (location || date) {
        metadata[imagePath] = { location, date };
      }
    } catch (error) {
      // Skip files that don't have EXIF data or can't be read
      console.log(`Skipping ${imagePath}: ${error.message}`);
    }
  }

  // Write metadata to JSON file
  const outputPath = path.join(__dirname, '..', 'src', 'lib', 'imageMetadata.json');
  fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));

  console.log(`Extracted metadata for ${Object.keys(metadata).length} images`);
  console.log(`Metadata saved to: ${outputPath}`);
}

extractMetadata().catch(console.error);
