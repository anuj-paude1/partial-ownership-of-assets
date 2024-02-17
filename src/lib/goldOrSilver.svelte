<script lang="ts">
  import { Button, Input } from "flowbite-svelte";


  import GoldChart from "../components/goldChart.svelte";
  import SilverChart from "../components/silverChart.svelte";
  import Icon from "@iconify/svelte";
  import { getCash, user } from "../store";
  getPrices()
  let goldPrice = 0;
  let silverPrice = 0;
  let goldAmount = 0;
  let silverAmount = 0;
  let totalGoldPrice = null
  $: {
    totalGoldPrice = goldAmount == 0? null : goldAmount * goldPrice
  }
  $: totalSilverPrice = silverAmount == 0? null : silverAmount * silverPrice;
  async function getPrices(){
    let res = await fetch('http://localhost:3000/current-gold-silver-price')
    let data = await res.json()
    console.log(data)
    goldPrice = data.goldPrice.prices[0]
    silverPrice = data.silverPrice.prices[0]
  }
  const handleBuyGold = async ()=>{
    let res = await fetch('http://localhost:3000/buy-gold', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: goldAmount,
          price: totalGoldPrice,
          username: $user?.username,
          password: $user?.password
        })
    })
    let data = await res.json()
    if(data.error){
        alert(data.error)
    }else{
        alert("sucess")
        getCash()
    }
  }
  const handleBuySilver = async ()=>{
    let res = await fetch('http://localhost:3000/buy-silver', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: silverAmount,
          price: totalSilverPrice,
          username: $user?.username,
          password: $user?.password
        })
    })
    let data = await res.json()
    if(data.error){
        alert(data.error)
    }else{
        alert("sucess")
        getCash()
    }
}

  let chartData = getChartData()
  async function getChartData(){
      let data = await fetch('http://localhost:3000/gold-silver-chart', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "toDate": "14-Jan-2024",
            "fromDate": "07-Jan-2024"
          }),
      })
      let chartData = await data.json()
      console.log(chartData)
      return chartData
  }
  let goldAmout = 0;
  let silverAmout = 0;

</script>
<div class="content p-10 w-full h-screen overflow-y-auto flex flex-col gap-10 pb-40">
    <div class="wrapper flex gap-20">
        <div class="left w-full flex flex-col gap-5">
            <h1 class="text-3xl text-white">Gold</h1>
            {#await chartData}
                <p class="text-lg text-white">loading...</p>
            {:then chartData}
                <GoldChart price={chartData.goldPrice} categories={chartData.goldDate} color="#FFD700" type="Gold Price" />
            {/await}
            <p class="text-xl text-white">Current Price: Rs {goldPrice.toFixed(2)} per Tola</p>
            
            <div class="flex gap-4">
                <input bind:value={goldAmount} class="w-64" type="text" placeholder="Amount in Tola" />
                <Button on:click={handleBuyGold}>
                    <div class="w-3 h-3 me-2">
                        <Icon icon="icon-park-outline:buy" />
                    </div>
                    Buy
                </Button>
            </div>
            <p class="text-xl text-red-600">Total Price: -Rs {totalGoldPrice ? totalGoldPrice.toFixed(2) :""}</p>

        </div>
        <div class="right w-full flex flex-col gap-5">
            <h1 class="text-3xl text-white">Silver</h1>
            {#await chartData}
            <p class="text-lg text-white">loading...</p>
        {:then chartData}
            <GoldChart price={chartData.silverPrice} categories={chartData.silverDate} color="silver" type="Gold Price" />
        {/await}
            <p class="text-xl text-white">Current Price: Rs {silverPrice.toFixed(2)} per Tola</p>
            
            <div class="flex gap-4">
                <input bind:value={silverAmount} class="w-64" type="text" placeholder="Amount in Tola" />
                <Button on:click={handleBuySilver}>
                    <div class="w-3 h-3 me-2">
                        <Icon icon="icon-park-outline:buy" />
                    </div>
                    Buy
                </Button>
            </div>
            <p class="text-xl text-red-600">Total Price: -Rs {totalSilverPrice ? totalSilverPrice.toFixed(2) :""}</p>
        </div>
    </div>
</div>