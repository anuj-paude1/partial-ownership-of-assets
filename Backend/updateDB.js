const { createRealEstate } = require("./models/realEstate");

const fs = require('fs');
const path = require('path');

// Function to read all image files from a folder and return an array of file paths
const readImagesFromFolder = (folderPath) => {
  const imageFiles = fs.readdirSync(folderPath);

  return imageFiles.map((fileName) => path.join(folderPath, fileName));
};

// Create an array to store dummy data
const dummyData = [];

// Create 11 dummy data entries
for (let i = 1; i <= 11; i++) {
  dummyData.push({
    location: `New Location ${i}`,
    lat: `New Latitude ${i}`,
    long: `New Longitude ${i}`,
    initialValuationPerShare: 100 + i,
    currentValuationPerShare: 120 + i,
    totalShareCount: 1000 + i,
    soldShareCount: 200 + i,
    revenue: 50000 + i,
    revenueDetails: `Details about revenue ${i}`,
    propertySize: `22 Ana ${i}`,
    structureDetails: `Residential House ${i}`,
    numberOfUnits: `15B, 5H, 5K ${i}`,
    yearBuilt: `2016 B.S ${i}`,
    accessibilityFeatures: [
      `1 Car Parking Space ${i}`,
      `3 Bike Parking Space ${i}`,
      `Garden (100 square feet) ${i}`,
    ],
    image: readImagesFromFolder(`../photos-db/${i}`),
    // Add other properties as needed
  });
}

// Insert dummy data using createRealEstate function
Promise.all(dummyData.map(createRealEstate))
  .then(() => {
    console.log('Real estate data added successfully.');
    // Add any additional logic after successful data insertion
  })
  .catch((error) => {
    console.error('Error adding real estate data:', error);
    // Handle errors appropriately
  });
