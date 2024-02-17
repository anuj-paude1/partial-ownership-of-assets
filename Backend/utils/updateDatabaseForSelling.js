const { realEstate } = require("../models/realEstate");
const realEstateTransaction = require("../models/realEstateTransaction");
const User = require("../models/User");
const pendingSellingUser = require("../models/pendingSellingUser");
const pendingBuyingEstate = require("../models/pendingBuyingEstate");
const pendingSellingEstate = require("../models/pendingSellingEstate");
const pendingBuyingUser = require("../models/pendingBuyingUser");
let value;
let rIndex;

const updateRealEstateForSelling = async (
    username,
    password,
    id,
    noOfSharesToSell,
    sellingAmountPerShare,
    res
) => {
    let realEstateData = await realEstate.findById(id);
    let sellingUserData = await User.findOne({
        username: username,
        password: password,
    });
    let hasShare, shareIndex;
    if (sellingUserData.totalShares) {
        hasShare = sellingUserData.totalShares.some(
            (share) => share.info._id.toString() === realEstateData._id.toString()
        );
        shareIndex = sellingUserData.totalShares.findIndex(
            (share) => share.info._id.toString() === realEstateData._id.toString()
        );
    }
    if (hasShare) {
        if (
            noOfSharesToSell <= sellingUserData.totalShares[shareIndex].numberOfShares
        ) {
            let pendingRealEstatesForSelling = await pendingSellingEstate.findOne({
                realEstate: realEstateData,
            });
            if (pendingRealEstatesForSelling) {
                const isSeller = pendingRealEstatesForSelling.pendingToBeSold.some(
                    (share) =>
                        share.user._id.toString() === sellingUserData._id.toString()
                );
                const userIndex =
                    pendingRealEstatesForSelling.pendingToBeSold.findIndex(
                        (share) =>
                            share.user._id.toString() === sellingUserData._id.toString()
                    );
                if (isSeller) {
                    pendingRealEstatesForSelling.pendingToBeSold[
                        userIndex
                    ].numberOfShares += parseInt(noOfSharesToSell);
                    pendingRealEstatesForSelling.pendingToBeSold[
                        userIndex
                    ].sellingPricePerShare = parseInt(sellingAmountPerShare);
                    await pendingRealEstatesForSelling.save();
                } else {
                    pendingRealEstatesForSelling.pendingToBeSold.push({
                        user: sellingUserData,
                        numberOfShares: noOfSharesToSell,
                        sellingPricePerShare: sellingAmountPerShare,
                    });
                    await pendingRealEstatesForSelling.save();
                }
            } else {
                let newData = new pendingSellingEstate({
                    realEstate: realEstateData,
                });
                newData.pendingToBeSold.push({
                    user: sellingUserData,
                    numberOfShares: noOfSharesToSell,
                    sellingPricePerShare: sellingAmountPerShare,
                });
                await newData.save();
            }
            sellingUserData.totalShares[shareIndex].numberOfShares -=
                parseInt(noOfSharesToSell);
            let amount = parseInt(noOfSharesToSell) * parseInt(sellingAmountPerShare);
            retrievePendingUsers(
                realEstateData,
                noOfSharesToSell,
                sellingAmountPerShare,
                username,
                password, res
            );
            await sellingUserData.save();
        } else {
            res.send("you do not have enough shares");
        }
        updatePendingSellingUser(
            username,
            password,
            realEstateData,
            noOfSharesToSell,
            res
        );
    } else {
        res.send("You don't have those shares");
    }
};

const updatePendingSellingUser = async (
    username,
    password,
    realEstateData,
    noOfSharesToSell,
    res
) => {
    let sellingUserData = await User.findOne({
        username: username,
        password: password,
    });
    let pendingSellingUserCheck = await pendingSellingUser.findOne({
        details: sellingUserData,
    });
    if (!pendingSellingUserCheck) {
        let pendingSellingUserData = new pendingSellingUser({
            details: sellingUserData,
        });

        pendingSellingUserData.realEstate.push(realEstateData);
        pendingSellingUserData.pendingSharesToSell.push({
            info: realEstateData,
            numberOfShares: noOfSharesToSell,
        });
        await pendingSellingUserData.save();
    } else {
        if (pendingSellingUserCheck.realEstate.includes(realEstateData._id)) {
            if (pendingSellingUserCheck.pendingSharesToSell.length) {
                let index = pendingSellingUserCheck.pendingSharesToSell.findIndex(
                    (item) => item.info._id.toString() === realEstateData._id.toString()
                );
                pendingSellingUserCheck.pendingSharesToSell[index].numberOfShares +=
                    parseInt(noOfSharesToSell);
            }
        } else {
            pendingSellingUserCheck.realEstate.push(realEstateData);
            pendingSellingUserCheck.pendingSharesToSell.push({
                info: realEstateData,
                numberOfShares: noOfSharesToSell,
            });
        }
        await pendingSellingUserCheck.save();
    }

    if (!realEstateData.owners.includes(sellingUserData._id)) {
        realEstateData.owners.push(sellingUserData._id);
        await realEstateData.save();
    }
};

const retrievePendingUsers = async (
    realEstateData,
    noOfSharesToSell,
    sellingAmountPerShare,
    username,
    password, res
) => {
    let account = await User.findOne({ username: username, password: password });
    let datas = await pendingBuyingEstate.findOne({ realEstate: realEstateData });
    if (!datas) {
        res.send("No Buyers Found! Added to Pending!");
    } else {
        let buyingUsersArray = datas.pendingToBeBought;
        let newArray = buyingUsersArray.filter(
            (e) =>
                e.buyingPricePerShare.toString() === sellingAmountPerShare.toString()
        );
        check(noOfSharesToSell, newArray);
        if (value === "Equal") {
            let buyingUserId = await User.findOne({ _id: newArray[rIndex].user._id });
            account.digitalCash +=
                parseInt(noOfSharesToSell) * parseInt(sellingAmountPerShare);
            let newArr = account.realEstate.filter(
                (e) => e._id.toString() !== realEstateData._id.toString()
            );
            account.realEstate = newArr;
            let newArr2 = account.totalShares.filter(
                (e) => e._id.toString() !== realEstateData.toString()
            );
            account.totalShares = newArr2;
            let newTransactionDetails = new realEstateTransaction({
                numberOfShares: noOfSharesToSell,
                realEstate: realEstateData,
                buyingUser: buyingUserId,
                sellingUser: account,
                investedPerShare: sellingAmountPerShare,
            });
            await newTransactionDetails.save();
            account.transactionDetails.push(newTransactionDetails);
            await account.save();
            buyingUserId.transactionDetails.push(newTransactionDetails);
            buyingUserId.totalShares.forEach((e) => {
                if (e.info._id.toString() === realEstateData._id.toString()) {
                    e.numberOfShares += noOfSharesToSell;
                }
            });
            buyingUserId.realEstate.push(realEstateData);
            await buyingUserId.save();

            let account2 = await pendingBuyingEstate.findOne({
                realEstate: realEstateData,
            });
            let array3 = account2.pendingToBeBought.filter(
                (e) => e.user._id.toString() !== buyingUserId._id.toString()
            );
            account2.pendingToBeBought = array3;
            await account2.save();

            let account3 = await pendingSellingEstate.findOne({
                realEstate: realEstateData,
            });
            let array4 = account3.pendingToBeSold.filter(
                (e) => e.user._id.toString() !== account._id.toString()
            );
            account3.pendingToBeSold = array4;
            await account3.save();

            let abcd = await realEstate.findOne({ _id: realEstateData._id });
            let cdef = abcd.owners.filter(
                (e) => e._id.toString() !== account._id.toString()
            );
            abcd.owners = cdef;
            await abcd.save();

            let ijkl = await pendingBuyingUser.findOne({ details: buyingUserId });
            let arr111 = ijkl.pendingSharesToBuy.filter(
                (e) => e.info._id.toString() !== realEstateData._id.toString()
            );
            ijkl.pendingSharesToBuy = arr111;
            await ijkl.save();

            let lmn = await pendingSellingUser.findOne({ details: account });
            let arr22 = lmn.pendingSharesToSell.filter(
                (e) => e.info._id.toString() !== realEstateData._id.toString()
            );
            lmn.pendingSharesToSell = arr22;
            await lmn.save();
        } else if (value === "Lesser") {
            let buyingUserId = await User.findOne({ _id: newArray[rIndex].user._id });
            account.digitalCash +=
                parseInt(noOfSharesToSell) * parseInt(sellingAmountPerShare);
            account.totalShares.forEach((e) => {
                if (e._id.toString() === realEstateData.toString()) {
                    e.numberOfShares -= noOfSharesToSell;
                }
            });

            buyingUserId.totalShares.forEach((e) => {
                if (e.info._id.toString() === realEstateData._id.toString()) {
                    e.numberOfShares += parseInt(noOfSharesToSell);
                }
            });

            let newTransactionDetails = new realEstateTransaction({
                numberOfShares: noOfSharesToSell,
                realEstate: realEstateData,
                buyingUser: buyingUserId,
                sellingUser: account,
                investedPerShare: sellingAmountPerShare,
            });
            await newTransactionDetails.save();
            account.transactionDetails.push(newTransactionDetails);
            buyingUserId.transactionDetails.push(newTransactionDetails);
            await account.save();
            await buyingUserId.save();

            let account2 = await pendingBuyingEstate.findOne({
                realEstate: realEstateData,
            });
            account2.pendingToBeBought.forEach((e) => {
                if (e.user._id.toString() === buyingUserId._id.toString()) {
                    e.numberOfShares -= parseInt(noOfSharesToSell);
                }
            });
            await account2.save();

            let account9 = await pendingBuyingUser.findOne({ details: buyingUserId });
            account9.pendingSharesToBuy.forEach((e) => {
                if (e.info._id.toString() === realEstateData._id.toString()) {
                    e.numberOfShares -= parseInt(noOfSharesToSell);
                }
            });

            await account9.save();

            let account0 = await pendingSellingUser.findOne({ details: account });
            account0.pendingSharesToSell.forEach((e) => {
                if (e.info._id.toString() === realEstateData._id.toString()) {
                    e.numberOfShares -= parseInt(noOfSharesToSell);
                }
            });
            await account0.save();

            let account69 = await pendingSellingEstate.findOne({
                realEstate: realEstateData,
            });
            let array69 = account69.pendingToBeSold.filter(
                (e) => e.user._id.toString() !== account._id.toString()
            );
            account69.pendingToBeSold = array69;
            await account69.save();
        } else {
            let buyingUsersArray = datas.pendingToBeBought;
            let newArray = buyingUsersArray.filter(
                (e) =>
                    e.buyingPricePerShare.toString() === sellingAmountPerShare.toString()
            );
            check(noOfSharesToSell, newArray);
            if (value === "Equal") {
                console.log("EQUAL");
                let buyingUserId = await User.findOne({
                    _id: newArray[rIndex].user._id,
                });
                account.digitalCash +=
                    parseInt(noOfSharesToSell) * parseInt(sellingAmountPerShare);
                let newArr = account.realEstate.filter(
                    (e) => e._id.toString() !== realEstateData._id.toString()
                );
                account.realEstate = newArr;
                let newArr2 = account.totalShares.filter(
                    (e) => e._id.toString() !== realEstateData.toString()
                );
                account.totalShares = newArr2;
                let newTransactionDetails = new realEstateTransaction({
                    numberOfShares: noOfSharesToSell,
                    realEstate: realEstateData,
                    buyingUser: buyingUserId,
                    sellingUser: account,
                    investedPerShare: sellingAmountPerShare,
                });
                await newTransactionDetails.save();
                account.transactionDetails.push(newTransactionDetails);
                await account.save();
                buyingUserId.transactionDetails.push(newTransactionDetails);
                buyingUserId.totalShares.forEach((e) => {
                    if (e.info._id.toString() === realEstateData._id.toString()) {
                        e.numberOfShares += noOfSharesToSell;
                    }
                });
                buyingUserId.realEstate.push(realEstateData);
                await buyingUserId.save();

                let account2 = await pendingBuyingEstate.findOne({
                    realEstate: realEstateData,
                });
                let array3 = account2.pendingToBeBought.filter(
                    (e) => e.user._id.toString() !== buyingUserId._id.toString()
                );
                account2.pendingToBeBought = array3;
                await account2.save();

                let account3 = await pendingSellingEstate.findOne({
                    realEstate: realEstateData,
                });
                let array4 = account3.pendingToBeSold.filter(
                    (e) => e.user._id.toString() !== account._id.toString()
                );
                account3.pendingToBeSold = array4;
                await account3.save();

                let abcd = await realEstate.findOne({ _id: realEstateData._id });
                let cdef = abcd.owners.filter(
                    (e) => e._id.toString() !== account._id.toString()
                );
                abcd.owners = cdef;
                await abcd.save();

                let ijkl = await pendingBuyingUser.findOne({ details: buyingUserId });
                let arr111 = ijkl.pendingSharesToBuy.filter(
                    (e) => e.info._id.toString() !== realEstateData._id.toString()
                );
                ijkl.pendingSharesToBuy = arr111;
                await ijkl.save();

                let lmn = await pendingSellingUser.findOne({ details: account });
                let arr22 = lmn.pendingSharesToSell.filter(
                    (e) => e.info._id.toString() !== realEstateData._id.toString()
                );
                lmn.pendingSharesToSell = arr22;
                await lmn.save();
            } else if (value === "Lesser") {
                console.log("LESSER");
                let buyingUserId = await User.findOne({
                    _id: newArray[rIndex].user._id,
                });
                account.digitalCash +=
                    parseInt(noOfSharesToSell) * parseInt(sellingAmountPerShare);
                account.totalShares.forEach((e) => {
                    if (e._id.toString() === realEstateData.toString()) {
                        e.numberOfShares -= noOfSharesToSell;
                    }
                });

                buyingUserId.totalShares.forEach((e) => {
                    if (e.info._id.toString() === realEstateData._id.toString()) {
                        e.numberOfShares += parseInt(noOfSharesToSell);
                    }
                });

                let newTransactionDetails = new realEstateTransaction({
                    numberOfShares: noOfSharesToSell,
                    realEstate: realEstateData,
                    buyingUser: buyingUserId,
                    sellingUser: account,
                    investedPerShare: sellingAmountPerShare,
                });
                await newTransactionDetails.save();
                account.transactionDetails.push(newTransactionDetails);
                buyingUserId.transactionDetails.push(newTransactionDetails);
                await account.save();
                await buyingUserId.save();

                let account2 = await pendingBuyingEstate.findOne({
                    realEstate: realEstateData,
                });
                account2.pendingToBeBought.forEach((e) => {
                    if (e.user._id.toString() === buyingUserId._id.toString()) {
                        e.numberOfShares -= parseInt(noOfSharesToSell);
                    }
                });
                await account2.save();

                let account9 = await pendingBuyingUser.findOne({
                    details: buyingUserId,
                });
                account9.pendingSharesToBuy.forEach((e) => {
                    if (e.info._id.toString() === realEstateData._id.toString()) {
                        e.numberOfShares -= parseInt(noOfSharesToSell);
                    }
                });

                await account9.save();

                let account0 = await pendingSellingUser.findOne({ details: account });
                account0.pendingSharesToSell.forEach((e) => {
                    if (e.info._id.toString() === realEstateData._id.toString()) {
                        e.numberOfShares -= parseInt(noOfSharesToSell);
                    }
                });
                await account0.save();

                let account69 = await pendingSellingEstate.findOne({
                    realEstate: realEstateData,
                });
                let array69 = account69.pendingToBeSold.filter(
                    (e) => e.user._id.toString() !== account._id.toString()
                );
                account69.pendingToBeSold = array69;
                await account69.save();
            } else {
                recursion(
                    noOfSharesToSell,
                    newArray,
                    account,
                    realEstateData,
                    sellingAmountPerShare
                );
            }
        }
        res.send("Buyer Found")
    }
};

function check(noOfSharesToSell, newArray, data) {
    for (let i = 0; i < newArray.length; i++) {
        for (let j = 0; j < newArray.length; j++) {
            if (parseInt(noOfSharesToSell) === parseInt(newArray[i].numberOfShares)) {
                rIndex = j;
                value = "Equal";
                break;
            }
        }
        if (value === "Equal") {
            break;
        } else if (
            parseInt(noOfSharesToSell) > parseInt(newArray[i].numberOfShares)
        ) {
            rIndex = i;
            value = "Greater";
            break;
        } else if (
            parseInt(noOfSharesToSell) < parseInt(newArray[i].numberOfShares)
        ) {
            rIndex = i;
            value = "Lesser";
            break;
        }
    }
}

async function recursion(
    noOfSharesToSell,
    newArray,
    account,
    realEstateData,
    sellingAmountPerShare
) {
    if (newArray.length && (noOfSharesToSell == newArray[0].numberOfShares)) {
        console.log("RECURSION");
        let buyingUserId = await User.findOne({ _id: newArray[0].user._id });
        let adddsss = await pendingBuyingEstate.findOne({
            realEstate: realEstateData,
        });
        let onetwothree = adddsss.pendingToBeBought;
        onetwothree.shift();
        adddsss.pendingToBeBought = onetwothree;
        await adddsss.save();

        let zzzzzzz = await pendingBuyingUser.findOne({ details: buyingUserId });
        let xxxxx = zzzzzzz.pendingSharesToBuy.filter(
            (e) => e.info._id.toString() !== realEstateData._id.toString()
        );
        zzzzzzz.pendingSharesToBuy = xxxxx;
        await zzzzzzz.save();

        let purge3 = await pendingSellingEstate.findOne({
            realEstate: realEstateData,
        });
        let filtersssss = purge3.pendingToBeSold.filter(
            (e) => e.user._id.toString() !== account._id.toString()
        );
        purge3.pendingToBeSold = filtersssss;

        await purge3.save();

        let purge4 = await pendingSellingUser.findOne({ details: account });
        let filters = purge4.pendingSharesToSell.filter(
            (e) => e.info._id.toString() !== realEstateData._id.toString()
        );

        purge4.pendingSharesToSell = filters;
        await purge4.save();

        let eee = await User.findOne({ _id: account._id });
        eee.totalShares.forEach(async (e) => {
            if (e.info._id.toString() === realEstateData._id.toString()) {
                e.numberOfShares -= noOfSharesToSell;
            }
        });
        await eee.save();

        let def3 = new realEstateTransaction({
            numberOfShares: noOfSharesToSell,
            realEstate: realEstateData,
            buyingUser: buyingUserId,
            sellingUser: account,
            investedPerShare: sellingAmountPerShare,
        });
        await def3.save();
        buyingUserId.transactionDetails.push(def3);
        account.transactionDetails.push(def3);

        let mmm = await realEstate.findOne({ _id: realEstateData._id });
        if (mmm.owners.includes(account._id)) {
            let dataFilter = mmm.owners.filter(
                (e) => e._id.toString() !== account._id.toString()
            );
            mmm.owners = dataFilter;
        }
        await mmm.save();

        if (!buyingUserId.realEstate.includes(realEstateData._id)) {
            buyingUserId.realEstate.push(realEstateData);
        }

        if (newArray.length && (noOfSharesToSell < newArray[0].numberOfShares)) {
            console.log("BASE 2");
            let buyingUserId = await User.findOne({ _id: newArray[0].user._id });
            buyingUserId.realEstate.push(realEstateData);
            buyingUserId.totalShares.forEach((e) => {
                if (e.info._id.toString() === realEstateData._id.toString()) {
                    e.numberOfShares += noOfSharesToSell;
                }
            });

            buyingUserId.totalShares.forEach(async (e) => {
                if (e.info._id.toString() === realEstateData._id.toString()) {
                    if (e.numberOfShares > 0) {
                        let nnn = await realEstate.findOne({ _id: realEstateData._id });
                        if (!nnn.owners.includes(buyingUserId._id)) {
                            nnn.owners.push(buyingUserId);
                        }
                        await nnn.save();
                    }
                }
            });

            let golo = await pendingBuyingEstate.findOne({
                realEstate: realEstateData,
            });
            golo.pendingToBeBought.forEach((e) => {
                if (e.user._id.toString() === buyingUserId._id.toString()) {
                    e.numberOfShares -= noOfSharesToSell;
                }
            });
            await golo.save();

            let aash = await pendingBuyingUser.findOne({ details: buyingUserId });
            aash.pendingSharesToBuy.forEach((e) => {
                if (e.info._id.toString() === realEstateData._id.toString()) {
                    e.numberOfShares -= parseInt(noOfSharesToSell);
                }
            });
            await aash.save();

            let purge = await pendingSellingEstate.findOne({
                realEstate: realEstateData,
            });
            let filterssss = purge.pendingToBeSold.filter(
                (e) => e.user._id.toString() !== account._id.toString()
            );
            purge.pendingToBeSold = filterssss;

            await purge.save();

            let purge2 = await pendingSellingUser.findOne({ details: account });
            let filtersss = purge2.pendingSharesToSell.filter(
                (e) => e.info._id.toString() !== realEstateData._id.toString()
            );

            purge2.pendingSharesToSell = filtersss;
            await purge2.save();
            let efg = new realEstateTransaction({
                numberOfShares: noOfSharesToSell,
                realEstate: realEstateData,
                buyingUser: buyingUserId,
                sellingUser: account,
                investedPerShare: sellingAmountPerShare,
            });
            await efg.save();
            buyingUserId.transactionDetails.push(efg);
            account.transactionDetails.push(efg);

            let ccc = await User.findOne({ _id: account._id });
            ccc.totalShares.forEach(async (e) => {
                if (e.info._id.toString() === realEstateData._id.toString()) {
                    e.numberOfShares -= noOfSharesToSell;
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
            await buyingUserId.save();
            await account.save();
            return;
        } else {
            console.log("FIRST LOOPSSS");
            let buyingUserId = await User.findOne({ _id: newArray[0].user._id });
            let dddsss = await pendingBuyingEstate.findOne({
                realEstate: realEstateData,
            });
            let remaining = dddsss.pendingToBeBought[0].numberOfShares;
            let onetwo = dddsss.pendingToBeBought;
            onetwo.shift();
            dddsss.pendingToBeBought = onetwo;
            await dddsss.save();
            let xyz = await pendingBuyingUser.findOne({ details: buyingUserId });
            let xy = xyz.pendingSharesToBuy.filter(
                (e) => e.info._id.toString() !== realEstateData._id.toString()
            );
            xyz.pendingSharesToBuy = xy;
            await xyz.save();

            buyingUserId.totalShares.map((e) => {
                if (e.info._id.toString() === realEstateData._id.toString()) {
                    e.numberOfShares += noOfSharesToSell;
                }
            });
            await ssh.save();
            await buyingUserId.save();
            await account.save();
            return;
        }
    }
}
module.exports = updateRealEstateForSelling;
