<script>
  import Investment from "../components/Investment.svelte";
import Transaction from "../components/Transaction.svelte";
  import Portfolio from "../components/portfolio.svelte";
import SmallCard from "../components/smallCard.svelte";

  import {DollarSolid, BriefcaseSolid
} from "flowbite-svelte-icons"
  import { cash, getUserInfo, user } from "../store";
  import AssetsPortfilio from "../components/AssetsPortfilio.svelte";
  let userInfo = getUserInfo()
      let type;
    let transictionData = getTransactionInfo();
    async function getTransactionInfo() {
      if ($user) {
        const response = await fetch(`http://localhost:3000/gold-silver-transactions/${$user.username}`);
        let data = await response.json();
        let g = data.goldTransactions
        let s = data.silverTransactions
        let newData = [...g, ...s]
        let x =  {transactions: newData, portfolio: {goldPortfolio:data.goldPortfolio, silverPortfolio: data.silverPortfolio, realStatePortfolio: data.totalShares}};
        return x
      }
      return null;
    }

    let investment  = 0;
    async function getInvestment(){
        let res = await fetch('http://localhost:3000/investment',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: $user?.username, password: $user?.password})
        }) 
        let data = await res.json()
        investment = data.totalInvestment
    }
    getInvestment()

</script>
  <div class="content p-10 w-full h-screen overflow-y-auto flex flex-col gap-10 pb-40">
    <div class="top w-full">
        <h1 class="text-3xl text-white font-semibold mb-4">Dashboard</h1>
        <div class="cards flex w-full gap-8">
            <SmallCard percentage="1.28%" value={"Rs " + investment.toFixed(2).toString()}/>
            <SmallCard LogoComp={DollarSolid} title="Current Balance" value={"Rs " + $cash.toFixed(2).toString()} type="loadMoney" />
            <SmallCard LogoComp={BriefcaseSolid} title="Divdend" value="Rs 592.0" />
            <SmallCard title="Maintain Charge" value="Rs 0"  />
        </div>
    </div>
    <div class="mid flex gap-10">
      {#await transictionData}
      {:then transictionData } 
         <AssetsPortfilio transactionDetails={transictionData.portfolio}/>
      {/await}
        <Portfolio/>
    </div>
    <div class="base">
      {#await transictionData}
      {:then transictionData }
      <Investment transictionData={transictionData.transactions}/>
      {/await}
    </div>
  </div>
  