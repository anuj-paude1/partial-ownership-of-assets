const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const fs = require("fs");
const path = require("path");
const { error } = require("console");

const realEstateSchema = new Schema({
  location: {
    type: String,
    required: true,
  },
  lat: {
    type: String,
    required: true,
  },
  long: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  initialValuationPerShare: {
    type: Number,
    required: true,
  },
  currentValuationPerShare: {
    type: Number,
    required: true,
  },
  totalShareCount: {
    type: Number,
    required: true,
  },
  soldShareCount: {
    type: Number,
    required: true,
  },
  revenue: {
    type: Number,
    required: true,
  },
  revenueDetails: {
    type: String,
    required: true,
  },
  owners: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  propertySize: {
    type: String,
    required: true,
  },
  structureDetails: {
    type: String,
    required: true,
  },
  numberOfUnits: {
    type: String,
    required: true,
  },
  yearBuilt: {
    type: String,
    required: true,
  },
  accessibilityFeatures: {
    type: [String],
    required: true,
  },
  image: [
    {
      data: {
        type: Buffer,
        required: true,
      },
    },
  ],
  transactionDetails: [
    {
      type: Schema.Types.ObjectId,
      ref: "realEstateTransaction",
    },
  ],
});

realEstateSchema.methods.calculateSoldShare = function () {
  return {
    soldShareInPercentage: (this.soldShareCount / this.totalShareCount) * 100,
  };
};

realEstateSchema.methods.checkForPending = function (
  soldShareCount,
  totalShareCount,
  noOfSharesToBuy
) {
  if (totalShareCount !== soldShareCount) {
    {
      if (totalShareCount - soldShareCount < noOfSharesToBuy) {
        let pendingShares =
          noOfSharesToBuy - (totalShareCount - soldShareCount);
        return {
          canBeBought: totalShareCount - soldShareCount,
          pending: pendingShares,
        };
      } else {
        return {
          canBeBought: noOfSharesToBuy,
          pending: 0,
        };
      }
    }
  } else {
    return {
      pending: noOfSharesToBuy,
    };
  }
};

realEstateSchema.methods.checkForPendingForSelling = function (
  totalShares,
  noOfSharesToSell
) {
  if (totalShares >= noOfSharesToSell) {
    let pendingShares = noOfSharesToSell - totalShares;
    return {
      canBeSold: totalShares - noOfSharesToSell,
      pendingWhileSelling: pendingShares,
    };
  } else {
    return "You don't have enough shares";
  }
};

let realEstate = mongoose.model("realEstate", realEstateSchema);

const createRealEstate = async (realEstateData) => {
  try {
    const { folderPath, ...restData } = realEstateData; // Destructure to remove folderPath
    const imageArray = [];

    // Read image files from the folder
    const imageFiles = await readImagesFromFolder(folderPath);

    // Iterate through each image file
    for (const fileName of imageFiles) {
      const filePath = path.resolve(folderPath, fileName); // Corrected: include folderPath
    
      // Read the file data and convert to base64
      const fileData = fs.readFileSync(filePath);
      const base64Data = fileData.toString("base64");
    
      // Add the base64 data to the image array
      imageArray.push({ data: Buffer.from(base64Data, "base64") });
    }

    // Set the image array in the rest of the realEstateData
    const updatedRealEstateData = { ...restData, image: imageArray };
    console.log(updatedRealEstateData)
    // Create a new real estate document
    const newRealEstate = new realEstate(updatedRealEstateData);
    newRealEstate.save()

    return "Real Estate Data Updated";
  } catch (err) {
    return err;
  }
};


const fs2 = require('fs').promises;

const readImagesFromFolder = async (folderPath) => {
  try {
    const imageFiles = await fs2.readdir(folderPath);
    return imageFiles;
  } catch (error) {
    console.error('Error reading folder:', error);
    throw error;
  }
};


module.exports = { realEstate, createRealEstate };
