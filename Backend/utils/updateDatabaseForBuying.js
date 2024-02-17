const { realEstate } = require("../models/realEstate");
const realEstateTransaction = require("../models/realEstateTransaction");
const User = require("../models/User");
const pendingBuyingUser = require("../models/pendingBuyingUser");
const pendingSellingUser = require("../models/pendingSellingUser");
const pendingBuyingEstate = require("../models/pendingBuyingEstate");
const pendingSellingEstate = require("../models/pendingSellingEstate");
let pIndex = 0;
let qIndex = 0;
let rIndex = 0;
let value;
let permission;

const updateRealEstateForBuying = async (
  username,
  password,
  id,
  noOfSharesToBuy,
  lastBoughtPricePerShare,
  res
) => {
  permission = true;
  let realEstateData = await realEstate.findById(id);
  let { totalShareCount, soldShareCount } = realEstateData;
  let pendingDetails = realEstateData.checkForPending(
    soldShareCount,
    totalShareCount,
    noOfSharesToBuy
  );
  let { canBeBought = 0, pending } = pendingDetails;

  if (canBeBought === 0) {
    let bbb = await pendingSellingEstate.findOne({});
    if (!bbb) {
      res.send("No Sellers Found, Added To Pending!");
    }
  } else {
    res.send("Shares bought successfully!");
    permission = false;
  }

  let realEstateData1 = await realEstate.findOneAndUpdate(
    { _id: id },
    {
      $inc: { soldShareCount: canBeBought },
      currentValuationPerShare: lastBoughtPricePerShare,
    },
    { new: true }
  );
  await updatePendingBuyingEstate(
    realEstateData1,
    username,
    password,
    pending,
    lastBoughtPricePerShare
  );
  await updatePendingBuyingUser(
    username,
    password,
    realEstateData1,
    pending,
    lastBoughtPricePerShare,
    canBeBought
  );
  await updateRealEstateTransactionForBuying(
    username,
    password,
    realEstateData1,
    noOfSharesToBuy,
    canBeBought
  );
  await retrievePendingUsers(
    realEstateData._id,
    noOfSharesToBuy,
    lastBoughtPricePerShare,
    username,
    password,
    res
  );
};

const updatePendingBuyingUser = async (
  username,
  password,
  realEstateData1,
  pending,
  lastBoughtPricePerShare,
  canBeBought
) => {
  let buyingUserData = await User.findOne({
    username: username,
    password: password,
  });
  let pendingBuyingUserCheck = await pendingBuyingUser.findOne({
    details: buyingUserData._id,
  });
  if (!pendingBuyingUserCheck) {
    let pendingBuyingUserData = new pendingBuyingUser({
      details: buyingUserData,
    });
    pendingBuyingUserData.realEstate.push(realEstateData1);
    pendingBuyingUserData.pendingSharesToBuy.push({
      info: realEstateData1,
      numberOfShares: pending,
      buyingPricePerShare: lastBoughtPricePerShare,
    });
    await pendingBuyingUserData.save();
  } else {
    if (pendingBuyingUserCheck.realEstate.includes(realEstateData1._id)) {
      let index = pendingBuyingUserCheck.pendingSharesToBuy.findIndex(
        (item) => item.info._id.toString() === realEstateData1._id.toString()
      );
      pendingBuyingUserCheck.pendingSharesToBuy[index].numberOfShares +=
        parseInt(pending);
    } else {
      pendingBuyingUserCheck.realEstate.push(realEstateData1);
      pendingBuyingUserCheck.pendingSharesToBuy.push({
        info: realEstateData1,
        numberOfShares: pending,
        buyingPricePerShare: lastBoughtPricePerShare,
      });
    }
    await pendingBuyingUserCheck.save();
  }

  if (!realEstateData1.owners.includes(buyingUserData._id)) {
    if (canBeBought) {
      realEstateData1.owners.push(buyingUserData._id);
      await realEstateData1.save();
    }
  }
};

const updateRealEstateTransactionForBuying = async (
  username,
  password,
  realEstateData1,
  noOfSharesToBuy,
  canBeBought
) => {
  let buyingUserData = await User.findOne({
    username: username,
    password: password,
  });
  let buyingData;
  if (canBeBought) {
    buyingData = new realEstateTransaction({
      numberOfShares: noOfSharesToBuy,
      realEstate: realEstateData1,
      buyingUser: buyingUserData,
      investedPerShare: realEstateData1.currentValuationPerShare,
    });
    realEstateData1.transactionDetails.push(buyingData);
    await buyingData.save();
    await realEstateData1.save();
  }
  updateUser(
    username,
    password,
    realEstateData1,
    canBeBought,
    buyingData,
    noOfSharesToBuy
  );
};

const updateUser = async (username, password, realEstateData1, canBeBought, buyingData, noOfSharesToBuy) => {
  let buyingUserData = await User.findOne({
    username: username,
    password: password,
  });
  buyingUserData.totalInvestment +=
    parseInt(noOfSharesToBuy) * realEstateData1.currentValuationPerShare;
  buyingUserData.digitalCash -=
    parseInt(noOfSharesToBuy) * realEstateData1.currentValuationPerShare;
  if (checkForExistingRealEstate(buyingUserData, realEstateData1._id.toString())) {
    buyingUserData.totalShares[qIndex].numberOfShares += parseInt(canBeBought);
  } else {
    buyingUserData.totalShares.push({
      info: realEstateData1,
      numberOfShares: canBeBought,
    });
  }
  if (buyingData) {
    buyingUserData.transactionDetails.push(buyingData);
  }

  if (!buyingUserData.realEstate.includes(realEstateData1._id)) {
    if (canBeBought) {
      buyingUserData.realEstate.push(realEstateData1._id);
    }
  }
  await buyingUserData.save();
};

const updatePendingBuyingEstate = async (
  realEstateData1,
  username,
  password,
  pending,
  lastBoughtPricePerShare
) => {
  let userData = await User.findOne({ username: username, password: password });
  let estateDataCheck = await pendingBuyingEstate.findOne({
    realEstate: realEstateData1,
  });
  if (!estateDataCheck) {
    if (parseInt(pending)) {
      let data = new pendingBuyingEstate({
        realEstate: realEstateData1,
      });
      data.pendingToBeBought.push({
        user: userData,
        numberOfShares: parseInt(pending),
        buyingPricePerShare: parseInt(lastBoughtPricePerShare),
      });
      await data.save();
    }
  } else {
    if (checkForExistingUser(estateDataCheck, userData._id.toString())) {
      estateDataCheck.pendingToBeBought[pIndex].numberOfShares += parseInt(pending);
      estateDataCheck.pendingToBeBought[pIndex].buyingPricePerShare = lastBoughtPricePerShare;
      await estateDataCheck.save();
    } else {
      if (parseInt(pending)) {
        estateDataCheck.pendingToBeBought.push({
          user: userData,
          numberOfShares: parseInt(pending),
          buyingPricePerShare: parseInt(lastBoughtPricePerShare),
        });
        await estateDataCheck.save();
      }
    }
  }
};

module.exports = updateRealEstateForBuying;

function checkForExistingUser(data, userId) {
  for (let i = 0; i < data.pendingToBeBought.length; i++) {
    if (data.pendingToBeBought[i].user._id.toString() === userId) {
      pIndex = i;
      return true;
    }
  }
  return false;
}
function checkForExistingRealEstate(data, realEstateId) {
  for (let i = 0; i < data.totalShares.length; i++) {
    if (data.totalShares[i].info._id.toString() === realEstateId) {
      qIndex = i;
      return true;
    }
  }
  return false;
}

const retrievePendingUsers = async (
  id,
  noOfSharesToBuy,
  lastBoughtPricePerShare,
  username,
  password,
  res
) => {
  let account = await User.findOne({ username: username, password: password });
  let realEstateData = await realEstate.findById(id);
  let datas = await pendingSellingEstate.findOne({
    realEstate: realEstateData,
  });
  if (!datas) { }
  else {
    let sellingUsersArray = datas.pendingToBeSold;
    let newArray = sellingUsersArray.filter(
      (e) =>
        e.sellingPricePerShare.toString() === lastBoughtPricePerShare.toString()
    );
    check(noOfSharesToBuy, newArray);
    if (value === "Equal") {
      console.log("ENTERED EQUAL");
      let sellingUserId = await User.findOne({
        _id: newArray[rIndex].user._id,
      });
      account.digitalCash -=
        parseInt(noOfSharesToBuy) * parseInt(lastBoughtPricePerShare);
      account.realEstate.push(realEstateData);
      let isPresent = account.totalShares.some(e => e.info._id.toString() === realEstateData._id.toString());
      let indexx = account.totalShares.findIndex(e => e.info._id.toString() === realEstateData._id.toString());
      if (!isPresent) {
        account.totalShares.push({
          info: realEstateData,
          numberOfShares: noOfSharesToBuy,
        });
      }
      else {
        account.totalShares[indexx].numberOfShares += noOfSharesToBuy;
      }

      await account.save();

      let newTransactionDetails = new realEstateTransaction({
        numberOfShares: noOfSharesToBuy,
        realEstate: realEstateData,
        buyingUser: account,
        sellingUser: sellingUserId,
        investedPerShare: realEstateData.currentValuationPerShare,
      });
      await newTransactionDetails.save();
      account.transactionDetails.push(newTransactionDetails);
      sellingUserId.transactionDetails.push(newTransactionDetails);
      let filters = sellingUserId.realEstate.filter(
        (e) => e._id.toString() !== realEstateData._id.toString()
      );
      sellingUserId.realEstate = filters;

      await sellingUserId.save();

      let six = await pendingBuyingEstate.findOne({
        realEstate: realEstateData,
      });
      six.pendingToBeBought.forEach((e) => {
        if (e.user._id.toString() === account._id.toString()) {
          e.numberOfShares -= noOfSharesToBuy;
        }
      });
      await six.save();

      let account2 = await pendingSellingEstate.findOne({
        realEstate: realEstateData,
      });
      let array3 = account2.pendingToBeSold.filter(
        (e) => e.user._id.toString() !== sellingUserId._id.toString()
      );
      account2.pendingToBeSold = array3;
      await account2.save();

      let abcd = await realEstate.findOne({ _id: realEstateData._id });
      let cdef = abcd.owners.filter(
        (e) => e._id.toString() !== account._id.toString()
      );
      abcd.owners = cdef;
      await abcd.save();

      let ijkl = await pendingSellingUser.findOne({ details: sellingUserId });
      let arr111 = ijkl.pendingSharesToSell.filter(
        (e) => e.info._id.toString() !== realEstateData._id.toString()
      );
      ijkl.pendingSharesToSell = arr111;
      await ijkl.save();

      let lmn = await pendingBuyingUser.findOne({ details: account });
      let arr22 = lmn.pendingSharesToBuy.filter(
        (e) => e.info._id.toString() !== realEstateData._id.toString()
      );
      lmn.pendingSharesToBuy = arr22;
      await lmn.save();
    } else if (value === "Lesser") {
      console.log("ENTERED LESSER");
      let sellingUserId = await User.findOne({
        _id: newArray[rIndex].user._id,
      });
      account.digitalCash -=
        parseInt(noOfSharesToBuy) * parseInt(lastBoughtPricePerShare);
      sellingUserId.digitalCash +=
        parseInt(noOfSharesToBuy) * parseInt(lastBoughtPricePerShare);
      account.totalShares.forEach((e) => {
        if (e._id.toString() === realEstateData.toString()) {
          e.numberOfShares += noOfSharesToBuy;
        }
      });

      let ggg = await realEstate.findOne({ _id: realEstateData._id });
      if (!ggg.owners.includes(account._id)) {
        ggg.owners.push(account);
      }
      await ggg.save();
      sellingUserId.totalShares.forEach((e) => {
        if (e.info._id.toString() === realEstateData._id.toString()) {
          e.numberOfShares -= parseInt(noOfSharesToBuy);
        }
      });

      let newTransactionDetails = new realEstateTransaction({
        numberOfShares: noOfSharesToBuy,
        realEstate: realEstateData,
        buyingUser: account,
        sellingUser: sellingUserId,
        investedPerShare: realEstateData.currentValuationPerShare,
      });
      await newTransactionDetails.save();
      account.transactionDetails.push(newTransactionDetails);
      sellingUserId.transactionDetails.push(newTransactionDetails);
      await account.save();
      await sellingUserId.save();

      let account2 = await pendingSellingEstate.findOne({
        realEstate: realEstateData,
      });
      account2.pendingToBeSold.forEach((e) => {
        if (e.user._id.toString() === sellingUserId._id.toString()) {
          e.numberOfShares -= parseInt(noOfSharesToBuy);
        }
      });
      await account2.save();

      let account9 = await pendingSellingUser.findOne({
        details: sellingUserId,
      });
      account9.pendingSharesToSell.forEach((e) => {
        if (e.info._id.toString() === realEstateData._id.toString()) {
          e.numberOfShares -= parseInt(noOfSharesToBuy);
        }
      });

      await account9.save();

      let account0 = await pendingBuyingUser.findOne({ details: account });
      account0.pendingSharesToBuy.forEach((e) => {
        if (e.info._id.toString() === realEstateData._id.toString()) {
          e.numberOfShares -= parseInt(noOfSharesToBuy);
        }
      });
      await account0.save();

      let account69 = await pendingBuyingEstate.findOne({
        realEstate: realEstateData,
      });
      let array69 = account69.pendingToBeBought.filter(
        (e) => e.user._id.toString() !== account._id.toString()
      );
      account69.pendingToBeBought = array69;
      await account69.save();
    } else {
      console.log("ENTERING RECURSION");
      recursion(
        noOfSharesToBuy,
        newArray,
        account,
        realEstateData,
        lastBoughtPricePerShare,
        res
      );
    }
  }
  if (permission) {
    res.send("Match Found");
  }
};

function check(noOfSharesToBuy, newArray, data) {
  for (let i = 0; i < newArray.length; i++) {
    for (let j = 0; j < newArray.length; j++) {
      if (parseInt(noOfSharesToBuy) === parseInt(newArray[i].numberOfShares)) {
        rIndex = j;
        value = "Equal";
        break;
      }
    }
    if (value === "Equal") {
      break;
    } else if (
      parseInt(noOfSharesToBuy) > parseInt(newArray[i].numberOfShares)
    ) {
      rIndex = i;
      value = "Greater";
      break;
    } else if (
      parseInt(noOfSharesToBuy) < parseInt(newArray[i].numberOfShares)
    ) {
      rIndex = i;
      value = "Lesser";
      break;
    }
  }
}

async function recursion(
  noOfSharesToBuy,
  newArray,
  account,
  realEstateData,
  lastBoughtPricePerShare,
  res
) {
  if (newArray.length && noOfSharesToBuy == newArray[0].numberOfShares) {
    console.log("ENTERED BASE EQUAL");
    let sellingUserId = await User.findOne({ _id: newArray[0].user._id });
    let adddsss = await pendingSellingEstate.findOne({
      realEstate: realEstateData,
    });
    let onetwothree = adddsss.pendingToBeSold;
    onetwothree.shift();
    adddsss.pendingToBeSold = onetwothree;
    await adddsss.save();

    let zzzzzzz = await pendingSellingUser.findOne({ details: sellingUserId });
    let xxxxx = zzzzzzz.pendingSharesToSell.filter(
      (e) => e.info._id.toString() !== realEstateData._id.toString()
    );
    zzzzzzz.pendingSharesToSell = xxxxx;
    await zzzzzzz.save();

    let purge3 = await pendingBuyingEstate.findOne({
      realEstate: realEstateData,
    });
    let filtersssss = purge3.pendingToBeBought.filter(
      (e) => e.user._id.toString() !== account._id.toString()
    );
    purge3.pendingToBeBought = filtersssss;

    await purge3.save();

    let purge4 = await pendingBuyingUser.findOne({ details: account });
    let filters = purge4.pendingSharesToBuy.filter(
      (e) => e.info._id.toString() !== realEstateData._id.toString()
    );

    purge4.pendingSharesToBuy = filters;
    await purge4.save();

    let eee = await User.findOne({ _id: account._id });
    eee.totalShares.forEach(async (e) => {
      if (e.info._id.toString() === realEstateData._id.toString()) {
        e.numberOfShares += noOfSharesToBuy;
      }
    });
    await eee.save();

    let def3 = new realEstateTransaction({
      numberOfShares: noOfSharesToBuy,
      realEstate: realEstateData,
      buyingUser: sellingUserId,
      sellingUser: account,
      investedPerShare: realEstateData.currentValuationPerShare,
    });
    await def3.save();
    sellingUserId.transactionDetails.push(def3);
    account.transactionDetails.push(def3);

    let mmm = await realEstate.findOne({ _id: realEstateData._id });
    if (mmm.owners.includes(account._id)) {
      let dataFilter = mmm.owners.filter(
        (e) => e._id.toString() !== account._id.toString()
      );
      mmm.owners = dataFilter;
    }
    await mmm.save();

    if (!sellingUserId.realEstate.includes(realEstateData._id)) {
      sellingUserId.realEstate.push(realEstateData);
    }

    let ssh = await realEstate.findOne({ _id: realEstateData._id });
    if (!ssh.owners.includes(sellingUserId._id)) {
      ssh.owners.push(sellingUserId._id);
    }

    sellingUserId.totalShares.map((e) => {
      if (e.info._id.toString() === realEstateData._id.toString()) {
        e.numberOfShares -= noOfSharesToBuy;
      }
    });
    await ssh.save();
    await sellingUserId.save();
    await account.save();
    res.send("Seller Found");
    return;
  }

  if (newArray.length && noOfSharesToBuy < newArray[0].numberOfShares) {
    console.log("ENTERED BASE LESS");
    let sellingUserId = await User.findOne({ _id: newArray[0].user._id });
    sellingUserId.realEstate.push(realEstateData);
    sellingUserId.totalShares.forEach((e) => {
      if (e.info._id.toString() === realEstateData._id.toString()) {
        e.numberOfShares -= noOfSharesToBuy;
      }
    });

    sellingUserId.totalShares.forEach(async (e) => {
      if (e.info._id.toString() === realEstateData._id.toString()) {
        if (e.numberOfShares > 0) {
          let nnn = await realEstate.findOne({ _id: realEstateData._id });
          if (!nnn.owners.includes(sellingUserId._id)) {
            nnn.owners.push(sellingUserId);
          }
          await nnn.save();
        }
      }
    });

    let golo = await pendingBuyingEstate.findOne({
      realEstate: realEstateData,
    });
    golo.pendingToBeSold.forEach((e) => {
      if (e.user._id.toString() === sellingUserId._id.toString()) {
        e.numberOfShares += noOfSharesToBuy;
      }
    });
    await golo.save();

    let aash = await pendingBuyingUser.findOne({ details: sellingUserId });
    aash.pendingSharesToSell.forEach((e) => {
      if (e.info._id.toString() === realEstateData._id.toString()) {
        e.numberOfShares -= parseInt(noOfSharesToBuy);
      }
    });
    await aash.save();

    let purge = await pendingBuyingEstate.findOne({
      realEstate: realEstateData,
    });
    let filterssss = purge.pendingToBeBought.filter(
      (e) => e.user._id.toString() !== account._id.toString()
    );
    purge.pendingToBeBought = filterssss;

    await purge.save();

    let purge2 = await pendingBuyingUser.findOne({ details: account });
    let filtersss = purge2.pendingToBeBought.filter(
      (e) => e.info._id.toString() !== realEstateData._id.toString()
    );

    purge2.pendingToBeBought = filtersss;
    await purge2.save();
    let efg = new realEstateTransaction({
      numberOfShares: noOfSharesToBuy,
      realEstate: realEstateData,
      buyingUser: sellingUserId,
      sellingUser: account,
      investedPerShare: realEstateData1.currentValuationPerShare,
    });
    await efg.save();
    sellingUserId.transactionDetails.push(efg);
    account.transactionDetails.push(efg);

    let ccc = await User.findOne({ _id: account._id });
    ccc.totalShares.forEach(async (e) => {
      if (e.info._id.toString() === realEstateData._id.toString()) {
        e.numberOfShares -= noOfSharesToBuy;
        if (e.numberOfShares == 0) {
          let ownerRemove = await realEstate.findOne({
            _id: realEstateData._id,
          });
          let mnas = ownerRemove.owners.filter(
            (e) => e._id.toString() === account._id.toString()
          );
          ownerRemove.owners = mnas;
          await ownerRemove.save();
        }
      }
    });

    await ccc.save();
    await sellingUserId.save();
    await account.save();
    res.send("Seller Found");
    return;
  } else if (newArray.length) {
    console.log("ENTERED FIRST LOOP");
    let sellingUserId = await User.findOne({ _id: newArray[0].user._id });
    let dddsss = await pendingSellingEstate.findOne({
      realEstate: realEstateData,
    });
    let remaining = dddsss.pendingToBeBought[0].numberOfShares;
    let onetwo = dddsss.pendingToBeBought;
    onetwo.shift();
    dddsss.pendingToBeBought = onetwo;
    await dddsss.save();
    let xyz = await pendingSellingUser.findOne({ details: sellingUserId });
    let xy = xyz.pendingSharesToSell.filter(
      (e) => e.info._id.toString() !== realEstateData._id.toString()
    );
    xyz.pendingSharesToSell = xy;
    await xyz.save();

    let abc = await pendingBuyingEstate.findOne({ realEstate: realEstateData });
    abc.pendingToBeSold.forEach((e) => {
      if (e.user._id.toString() === account._id.toString()) {
        e.numberOfShares += parseInt(remaining);
      }
    });
    await abc.save();

    let bcd = await pendingBuyingUser.findOne({ details: account });
    bcd.pendingSharesToBuy.forEach((e) => {
      if (e.info._id.toString() === realEstateData._id.toString()) {
        e.numberOfShares += parseInt(remaining);
      }
    });
    await bcd.save();

    let def = new realEstateTransaction({
      numberOfShares: remaining,
      realEstate: realEstateData,
      buyingUser: sellingUserId,
      sellingUser: account,
      investedPerShare: realEstateData.currentValuationPerShare,
    });
    await def.save();
    sellingUserId.transactionDetails.push(def);
    account.transactionDetails.push(def);

    account.totalShares.forEach((e) => {
      if (e.info._id.toString() === realEstateData._id.toString()) {
        e.numberOfShares += parseInt(remaining);
      }
    });

    if (!sellingUserId.realEstate.includes(realEstateData._id)) {
      sellingUserId.realEstate.push(realEstateData);
    }
    sellingUserId.totalShares.forEach((e) => {
      if (e.info._id.toString() === realEstateData._id.toString()) {
        e.numberOfShares -= parseInt(remaining);
      }
    });

    let ssh = await realEstate.findOne({ _id: realEstateData._id });
    if (!ssh.owners.includes(sellingUserId._id)) {
      ssh.owners.push(sellingUserId._id);
    }
    await ssh.save();
    await account.save();
    await sellingUserId.save();
    let mn = noOfSharesToBuy - remaining;
    newArray.shift();
    recursion(mn, newArray, account, realEstateData, lastBoughtPricePerShare);
  }
}
