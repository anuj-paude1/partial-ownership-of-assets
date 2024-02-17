<script lang="ts">
  import { Button, Input, Label, Select, Toggle } from "flowbite-svelte";
  import { navigate, useNavigate, useParams } from "svelte-navigator";
  import TopTable from "../components/TopTable.svelte";
  import PendingOrderTable from "../components/pendingOrderTable.svelte";
  import { getCash, user } from "../store";
  export let q;
  let selectId: any;
  if(q){
    selectId = q.id
  }else{
    selectId = undefined
  }
  let selectProp = selectId ? selectId : undefined
  let share = 10;
  let price;
  let isSell = false;
  let partial = true
  let transferType = "Realstate"
  let isGold = true
  let goldOrSilverAmmount = 0;
  let goldPrice = 0;
  let silverPrice = 0;
  let selected;
  async function getPrices(){
    let res = await fetch('http://localhost:3000/current-gold-silver-price')
    let data = await res.json()
    console.log(data)
    goldPrice = data.goldPrice.prices[0]
    silverPrice = data.silverPrice.prices[0]
  }
  getPrices()
//   const getBuyingRealState = async ()=>{
//     let res = await fetch('http://localhost:3000/all-real-estates/')
//     let data = await res.json()
//     return data.map((item)=>{return {value: item.realEstateId, name: item.realEstateUsername}})
//   }
//   let buyingRealStateData = getBuyingRealState()

//   const getSellingRealState = async ()=>{
//     let res = await fetch('http://localhost:3000/real-estate/'+$user?.username)
//     let data = await res.json()
//     return data.map((item)=>{return {value: item.realEstateId, name: item.realEstateUsername}})
//   }
//   let SellingRealStateData = getSellingRealState()


//   let currentPrice = 0;

//   async function getCurrentPrice(){
//     let res = await fetch(`http://localhost:3000/getCurrentPrice/${selectId}`)
//     let data = await res.json()
//     currentPrice = data.price
//     console.log(currentPrice)
//   }
//   getCurrentPrice()

  const handleBuy = async ()=>{
    let res1 = await fetch(`http://localhost:3000/getCurrentPrice/${selectId}`)
    let data1 = await res1.json()
    let currentPrice = data1.price

    if(price < currentPrice){
        alert("Price should be greater than current price")
        return 
    }
    let res = await fetch(`http://localhost:3000/buyrealestate/${selectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noOfSharesToBuy: share, lastBoughtPricePerShare: price, username: $user?.username, password: $user?.password }),
    })
    let data = await res.text()
    if(data == "updated buying"){
        alert("Sucessfully bought")
        getCash()
    }else{
        alert(data)
        getCash()
    }
  }
  const handleSell = async ()=>{
    let res = await fetch(`http://localhost:3000/sellrealestate/${selectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noOfSharesToSell: share, sellingAmountPerShare: price, username: $user?.username, password: $user?.password }),
    })
    let data = await res.text()
    if(data == "updated selling"){
        alert("Sucessfully sold")
        getCash()
    }else{
        alert(data)
        getCash()

    }
  }
  const handleSellGoldOrSilver = async ()=>{
    let res = await fetch(`http://localhost:3000/sell-${isGold ? "gold" : "silver"}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: $user?.username, password: $user?.password, amount: goldOrSilverAmmount, price: goldOrSilverAmmount * (goldOrSilverAmmount > 0 ? goldPrice : silverPrice)}), })
    let data = await res.json()
    if(data.error){
        alert(data.error)
        getCash()

    }else{
        alert("Sucess")
        getCash()
    }
  }

</script>
<div class="content p-10 w-full h-screen overflow-y-auto flex gap-10 pb-40 text-white">
    <div class="left w-1/2">
        <div class="top flex gap-3 mb-5">
            <span class="text-2xl">Buy</span>
            <Toggle bind:checked={isSell} />
            <span class="text-2xl">Sell</span>
        </div>
    <div class="mid flex flex-col gap-5">
        <p class="text-2xl">Category:</p>
        <div class="flex gap-5">
            <Button color={transferType == "Realstate" ? "blue" : ""} on:click={() => transferType = "Realstate"}>Real State</Button>
            {#if !selectId }
                <Button color={transferType == "Gold" ? "blue" : ""} on:click={() => {
                    transferType = "Gold"
                    if(!isSell) navigate("/goldOrSilver")
                }}>Gold / Silver</Button>
            {/if}
        </div>
        {#if transferType == "Realstate"}
        <p class="text-2xl">Select Property :</p>
        <!-- {#if isSell}
            {#await SellingRealStateData}
            {:then SellingRealStateData} 
            <Label>
                    <Select  class="mt-2" items={SellingRealStateData} bind:value={selected} />
            </Label>
            {/await}
        {/if} -->
        <Input size="sm" type="text" bind:value={selectId} />
        <p class="text-2xl">Share:</p>
        <Input size="sm" type="text" bind:value={share} />
        <div class="validity flex gap-4 items-center">
            <p class="text-2xl">Partial:</p>
            <Toggle bind:checked={partial} />
        </div>
        <p class="text-2xl">Price:</p>
        <Input size="sm" type="text" bind:value={price} />
        <p class="text-2xl">Total Price:</p>
        <Button color="blue" on:click={isSell ? handleSell : handleBuy}>{isSell ? "Sell" : "Buy"}</Button>
        {:else}
        <div class="top flex gap-3 mb-5">
            <span class="text-xl">Silver</span>
            <Toggle bind:checked={isGold} />
            <span class="text-xl">Gold</span>
        </div>
        <p class="text-2xl">Amount In Tola:</p>
        <Input size="sm" type="text" bind:value={goldOrSilverAmmount} />
        <p class="text-xl">Price: Rs{isGold ? goldPrice.toFixed(2) : silverPrice.toFixed(2)} per Tola</p>
        <p class="text-2xl text-green-500">Total Price:Rs +{isGold ? (goldOrSilverAmmount * goldPrice).toFixed(2) : (goldOrSilverAmmount * silverPrice).toFixed(2)}</p>
        <Button color="blue" on:click={handleSellGoldOrSilver}>{isGold ? "Sell Gold" : "Sell Silver"}</Button>

        {/if}
    </div>
</div>

    <div class="right w-1/2">
        <div class="top">
            LTP : 2,271 ( 2.6 % )
        </div>
        <div class="mid flex">
            <div class="buy">
                <h1 class="text-center bg-blue-600 p-1">Buy</h1>
                {#if selectId}
                    <TopTable />
                {/if}
            </div>
            <!-- <div class="sell">
                <h1 class="text-center bg-red-600 p-1">Sell</h1>
                <TopTable />
            </div> -->
        </div>
        <div class="bottom mt-10 flex flex-col gap-3">
            <h1 class="text-2xl">Pending Order</h1>
            {#if selectId}
            <PendingOrderTable />
            {/if}
            </div>
    </div>
</div>