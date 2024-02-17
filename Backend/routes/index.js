require("dotenv").config();
var express = require("express");
var router = express.Router();
const User = require("../models/User");
const auth = require("../utils/auth");
const { realEstate, createRealEstate } = require("../models/realEstate");
const updateRealEstateForBuying = require("../utils/updateDatabaseForBuying");
const updateRealEstateForSelling = require("../utils/updateDatabaseForSelling");
const pendingBuyingUser = require("../models/pendingBuyingUser");
const pendingSellingUser = require("../models/pendingSellingUser");
const realEstateTransaction = require("../models/realEstateTransaction");
const pendingBuyingEstate = require("../models/pendingBuyingEstate");
const pendingSellingEstate = require("../models/pendingSellingEstate");
const { Gold, Silver } = require("../models/goldOrSilver");

router.get("/test", async (req, res) => {
  res.send("gg");
});

router.post("/auth/register", async (req, res) => {
  let data = req.body;
  let { username, password } = data;
  let user = await User.findOne({ username });
  if (user) {
    res.send({ error: "User Already Exists", type: "error" });
    return;
  } else {
    let newUser = new User(data);
    let gold = new Gold({
      amountInTola: 0,
      investedAmount: 0,
      User: newUser._id,
      transactions: [],
    });
    gold.save();
    newUser.gold = gold;
    let silver = new Silver({
      amountInTola: 0,
      investedAmount: 0,
      User: newUser._id,
      transactions: [],
    });
    silver.save();
    newUser.silver = silver;
    let savedUser = await newUser.save();
    return res.send(savedUser);
  }
});

router.post("/buyrealestate/:id", auth, async (req, res, next) => {
  let { noOfSharesToBuy, lastBoughtPricePerShare } = req.body;
  let userData = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (
    userData.digitalCash <
    parseInt(noOfSharesToBuy) * parseInt(lastBoughtPricePerShare)
  ) {
    res.send("YOU DO NOT HAVE ENOUGH CASH");
  } else {
    updateRealEstateForBuying(
      req.body.username,
      req.body.password,
      req.params.id,
      noOfSharesToBuy,
      lastBoughtPricePerShare,
      res
    );
  }
});

router.post("/sellrealestate/:id", auth, async (req, res, next) => {
  let { noOfSharesToSell, sellingAmountPerShare } = req.body;
  await updateRealEstateForSelling(
    req.body.username,
    req.body.password,
    req.params.id,
    noOfSharesToSell,
    sellingAmountPerShare,
    res
  );
});

router.post("/getuserinfo", auth, async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password }).populate({
      path: "transactionDetails",
      populate: {
        path: "realEstate",
        model: "realEstate",
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password: userPassword, ...userData } = user.toObject();

    const sanitizedTransactionDetails = userData.transactionDetails.map(
      (transaction) => {
        const { buyingUser, __v, _id, ...rest } = transaction;
        return rest;
      }
    );

    const sanitizedData = {
      ...userData,
      transactionDetails: sanitizedTransactionDetails,
    };

    res.send(sanitizedData);
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/realestatedataupdate", async (req, res) => {
  let data = req.body;
  try {
    res.send(createRealEstate(data));
  } catch (error) {
    throw customError(101, "hehe");
  }
});

router.get("/getallrealestate", async (req, res) => {
  let data = await realEstate.find();
  res.send(data);
});

router.get('/dropdown', async (req, res) => {
  let data = await realEstate.find();
  let filteredArray = data.map((item) => {
    const { _id, username } = item;
    return { _id, username };
  });
  res.send(filteredArray);
})

router.get("/realestatedata/:id", async (req, res) => {
  let id = req.params.id;
  let data = await realEstate.findById(id).populate("transactionDetails");
  let parsedData = JSON.parse(JSON.stringify(data));
  res.send(parsedData);
});
router.get("/getPendingSelling/:id", async (req, res) => {
  let realstate = await realEstate.findById(req.params.id);
  if (!realstate) {
    return res.send({ error: "realstate not found" });
  }
  let pendingBuyers = await pendingSellingEstate.findOne({
    realEstate: realstate._id,
  });
  if (!pendingBuyers) {
    return res.send({ error: "pendingSellers not found" });
  }
  let pending = pendingBuyers.pendingToBeSold;
  return res.send(pendingBuyers);
});

router.get("/getPendingBuying/:id", async (req, res) => {
  let realstate = await realEstate.findById(req.params.id);
  if (!realstate) {
    return res.send({ error: "realstate not found" });
  }
  let pendingBuyers = await pendingBuyingEstate.findOne({
    realEstate: realstate._id,
  });
  if (!pendingBuyers) {
    return res.send({ error: "pendingBuyers not found" });
  }
  let pending = pendingBuyers.pendingToBeSold;
  return res.send(pendingBuyers);
});

router.post("/usercash", async (req, res) => {
  let { username, password } = req.body;
  let user = await User.findOne({ username, password });
  if (user) {
    res.send({ cash: user.digitalCash });
  } else {
    res.send({ cash: 0 });
  }
});


// GET request to fetch all real estates associated with a user based on username
router.get('/real-estate/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user by username
    const user = await User.findOne({ username });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user has associated real estates
    if (!user.realEstate || user.realEstate.length === 0) {
      return res.status(404).json({ error: 'No real estates found for the user' });
    }

    // Find all real estates associated with the user
    const realEstates = await realEstate.find({ _id: { $in: user.realEstate } });
    // Return the real estate information
    const realEstateInfo = realEstates.map((realEstate) => ({
      realEstateId: realEstate._id,
      realEstateUsername: realEstate.username,
    }));

    res.status(200).json(realEstateInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;


async function abcd() {
  await pendingBuyingEstate.deleteMany({});
  await pendingBuyingUser.deleteMany({});
  await pendingSellingEstate.deleteMany({});
  await pendingSellingUser.deleteMany({});
  await realEstateTransaction.deleteMany({});
  let abc = await realEstate.findOne({});
  abc.soldShareCount = 180;
  abc.currentValuationPerShare = 100;
  await abc.save();

  let user = await User.findOne({ username: 'atul_tiwari' });
  user.totalShares = [];
  user.realEstate = [];
  user.transactionDetails = [];
  await user.save()

  let user1 = await User.findOne({ username: 'Rabin_lc' });
  user1.totalShares = [];
  user1.realEstate = [];
  user1.transactionDetails = [];
  await user1.save()


};

// abcd();