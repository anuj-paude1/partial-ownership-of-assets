const express = require("express");
const router = express.Router();
const { Gold, Silver } = require("../models/goldOrSilver");
const {
  SilverTransaction,
  GoldTransaction,
} = require("../models/goldOrSilverTransaction");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");

router.get("/goldHealth", async (req, res) => {
  res.status(200).send("hehe");
});

// View Gold and Silver Transactions and Portfolio
router.get("/gold-silver-transactions/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username })
      .populate({
        path: "gold",
        populate: {
          path: "transactions",
          model: "GoldTransaction",
        },
      })
      .populate({
        path: "silver",
        populate: {
          path: "transactions",
          model: "SilverTransaction",
        },
      })
      .populate({
        path: "totalShares",
        populate: {
          path: "info",
          model: "realEstate",
        },
      });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract gold and silver transactions from the user's data
    const goldTransactions = user.gold.transactions;
    const silverTransactions = user.silver.transactions;

    // Extract gold and silver portfolio details
    const goldPortfolio = {
      amountInTola: user.gold.amountInTola,
      totalInvestment: user.gold.totalInvestment,
    };

    const silverPortfolio = {
      amountInTola: user.silver.amountInTola,
      totalInvestment: user.silver.totalInvestment,
    };
    const totalShares = user.totalShares;

    res.status(200).json({
      goldTransactions,
      silverTransactions,
      goldPortfolio,
      silverPortfolio,
      totalShares,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Buy Gold
router.post("/buy-gold", async (req, res) => {
  try {
    const { price, amount, username, password } = req.body;
    const user = await User.findOne({ username }).populate("gold");

    // Check if the user exists and the password is correct
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (user.digitalCash < price) {
      return res.send({ error: "insufficient cash" });
    }
    // Create a new gold transaction
    const newGoldTransaction = new GoldTransaction({
      amount: amount,
      price: price,
      gold: user.gold._id, // Assuming user is authenticated, use the user's ID
      user: user._id, // Set the user ID who is buying the gold
    });

    // Save the gold transaction to the database
    const savedTransaction = await newGoldTransaction.save();
    // Link the transaction to the Gold model
    const updatedGold = await Gold.findByIdAndUpdate(
      { _id: user.gold._id },
      {
        $inc: { amountInTola: amount, investedAmount: parseFloat(price) },
        $push: { transactions: savedTransaction._id },
      },
      { new: true }
    );

    user.digitalCash = user.digitalCash - price;
    user.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Buy Silver
router.post("/buy-silver", async (req, res) => {
  try {
    const { price, amount, username, password } = req.body;
    const user = await User.findOne({ username }).populate("silver");

    // Check if the user exists and the password is correct
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.digitalCash < price) {
      return res.status(400).json({ error: "Insufficient cash" });
    }

    // Create a new silver transaction
    const newSilverTransaction = new SilverTransaction({
      amount: amount,
      price: price,
      silver: user.silver._id,
      user: user._id,
    });

    // Save the silver transaction to the database
    const savedTransaction = await newSilverTransaction.save();

    // Link the transaction to the Silver model and update user's silver details
    const updatedSilver = await Silver.findByIdAndUpdate(
      { _id: user.silver._id },
      {
        $inc: { amountInTola: amount, investedAmount: price },
        $push: { transactions: savedTransaction._id },
      },
      { new: true }
    );

    user.digitalCash -= price; // Decrease user's digital cash after buying silver
    user.save();

    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Sell Gold
router.post("/sell-gold", async (req, res) => {
  try {
    const { price, amount, username, password } = req.body;
    const user = await User.findOne({ username }).populate("gold");

    // Check if the user exists and the password is correct
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if the user has enough gold to sell
    if (user.gold.amountInTola < amount) {
      return res.status(400).json({ error: "Insufficient gold balance" });
    }

    // Create a new gold transaction for selling
    const newGoldTransaction = new GoldTransaction({
      amount: -amount, // Negative amount for selling
      price: price,
      gold: user.gold._id,
      user: user._id,
    });

    // Save the gold transaction to the database
    const savedTransaction = await newGoldTransaction.save();

    // Link the transaction to the Gold model
    const updatedGold = await Gold.findByIdAndUpdate(
      { _id: user.gold._id },
      {
        $inc: { amountInTola: -amount },
        $push: { transactions: savedTransaction._id },
      },
      { new: true }
    );

    // Increase the user's digital cash
    user.digitalCash += price;
    await user.save();

    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Sell Silver
router.post("/sell-silver", async (req, res) => {
  try {
    const { price, amount, username, password } = req.body;
    const user = await User.findOne({ username }).populate("silver");

    // Check if the user exists and the password is correct

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Check if the user has enough silver to sell
    if (user.silver.amountInTola < amount) {
      return res.status(400).json({ error: "Insufficient silver balance" });
    }

    // Create a new silver transaction for selling
    const newSilverTransaction = new SilverTransaction({
      amount: -amount, // Negative amount for selling
      price: price,
      silver: user.silver._id,
      user: user._id,
    });

    // Save the silver transaction to the database
    const savedTransaction = await newSilverTransaction.save();

    // Link the transaction to the Silver model
    const updatedSilver = await Silver.findByIdAndUpdate(
      { _id: user.silver._id },
      {
        $inc: { amountInTola: -amount },
        $push: { transactions: savedTransaction._id },
      },
      { new: true }
    );

    // Increase the user's digital cash
    user.digitalCash += price;
    await user.save();

    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to get current gold price in Nepal
router.get("/current-gold-silver-price", async (req, res) => {
  try {
    const currentDate = getCurrentDate();
    const goldPrice = await readFileData(
      "gold_new.txt",
      currentDate,
      currentDate
    );
    const silverPrice = await readFileData(
      "silver_new.txt",
      currentDate,
      currentDate
    );

    // Send the response
    console.log(goldPrice, silverPrice);
    res.json({ currentDate, goldPrice, silverPrice });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

function getCurrentDate() {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}

router.post("/gold-silver-chart", async (req, res) => {
  const { fromDate, toDate } = req.body;

  try {
    const goldData = await readFileData("gold_new.txt", fromDate, toDate);
    const silverData = await readFileData("silver_new.txt", fromDate, toDate);

    // Process data and send the response
    const responseData = {
      goldPrice: goldData.prices,
      goldDate: goldData.dates,
      silverPrice: silverData.prices,
      silverDate: silverData.dates,
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

async function readFileData(filename, fromDate, toDate) {
  const filepath = path.join(__dirname, filename);
  const fileData = fs.readFileSync(filepath, "utf-8");

  // Parse the file data and filter based on date range
  const lines = fileData.split("\n");
  const prices = [];
  const dates = [];
  lines.forEach((line) => {
    const [date, price] = line.split(",");
    // Assuming date is in 'DD-Mon-YYYY' format
    const currentDate = new Date(date);
    if (currentDate >= new Date(fromDate) && currentDate <= new Date(toDate)) {
      dates.push(date);
      prices.push(parseFloat(price));
    }
  });

  const parsedData = {
    prices: prices,
    dates: dates,
  };

  return parsedData;
}

module.exports = router;
