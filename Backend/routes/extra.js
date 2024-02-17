require("dotenv").config();
var express = require("express");
const User = require("../models/User");
const { Gold, Silver } = require("../models/goldOrSilver");
const { realEstate } = require("../models/realEstate");
var router = express.Router();

router.post("/investment", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username and populate gold and silver references
    const user = await User.findOne({ username }).populate({
      path: "gold",
      path: "silver",
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Sum up the total investment from various sources (real estate, gold, silver, etc.)
    let totalInvestment = user.totalInvestment || 0;

    // Add total investment from gold
    if (user.gold) {
      totalInvestment += user.gold.investedAmount || 0;
    }

    // Add total investment from silver
    if (user.silver) {
      totalInvestment += user.silver.investedAmount || 0;
    }

    res.status(200).json({ totalInvestment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/investmentPart/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username })
      .populate("gold")
      .populate("silver");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).send({
      realState: user.totalInvestment,
      gold: user.gold.investedAmount,
      silver: user.silver.investedAmount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getRealStateTransaction/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const realState = await realEstate
      .findById(id)
      .populate("transactionDetails");
    if (!realState) {
      return res.status(404).json({ error: "RealState not found" });
    }
    res.status(200).send({
      details: realState.transactionDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getCurrentPrice/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const realState = await realEstate.findById(id);
    if (!realState) {
      return res.status(404).json({ error: "RealState not found" });
    }
    res.status(200).send({
      price: realState.currentValuationPerShare,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getTransaction/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const realState = await realEstate
      .findById(id)
      .populate("transactionDetails");
    if (!realState) {
      return res.status(404).json({ error: "RealState not found" });
    }
    console.log("==============================");
    res.status(200).send({
      details: realState.transactionDetails,
      price: realState.currentValuationPerShare,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/shares-info', async (req, res) => {
  try {
    // Fetch all real estate shares and populate the necessary fields
    const shares = await realEstate.find().populate({
      path: 'transactionDetails',
      model: 'realEstateTransaction',
      populate: {
        path: 'buyingUser sellingUser',
        model: 'User',
      },
    });

    const sharesInfo = [];

    // Iterate through each share and gather required information
    for (const share of shares) {
      const transactions = share.transactionDetails;
      const transactionCount = transactions.length;
      console.log(transactions)
      // Initialize values for cases where there are no transactions or only one transaction
      let lastTradedPrice = 0;
      let lowestPriceOfDay = 0;
      let highestPriceOfDay = 0;
      let changeInPrice = 0;
      let buyingUser = null;
      let sellingUser = null;
      let volumeTradedPerDay = 0;

      if (transactionCount > 0) {
        const lastTransaction = transactions[transactionCount - 1];
        lastTradedPrice = share.currentValuationPerShare;
        lowestPriceOfDay = lastTransaction.investedPerShare;
        highestPriceOfDay = lastTransaction.investedPerShare;

        for (const transaction of transactions) {
          // Calculate lowest and highest prices of the day
          if (transaction.investedPerShare < lowestPriceOfDay) {
            lowestPriceOfDay = transaction.investedPerShare;
          }
          console.log('xiryo');
          console.log(lastTransaction.investedPerShare);
          console.log(highestPriceOfDay);
          if (transaction.investedPerShare > highestPriceOfDay) {
            highestPriceOfDay = transaction.investedPerShare;
          }

          // Accumulate volume traded per day (shares * price)
          volumeTradedPerDay += transaction.numberOfShares * transaction.investedPerShare;
        }

        changeInPrice = lastTransaction.investedPerShare - lastTradedPrice;
        buyingUser = lastTransaction.buyingUser ? lastTransaction.buyingUser.username : null;
        sellingUser = lastTransaction.sellingUser ? lastTransaction.sellingUser.username : null;
      }

      sharesInfo.push({
        propertyUsername: share.username,
        location: share.location,
        lastTradedPrice,
        lowestPriceOfDay,
        highestPriceOfDay,
        changeInPrice,
        buyingUser,
        sellingUser,
        volumeTradedPerDay,
      });
    }

    res.status(200).json(sharesInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
