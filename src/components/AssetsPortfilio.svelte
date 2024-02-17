<script lang="ts">
    import { Card, Input, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from "flowbite-svelte";
    import { ChartMixedSolid, SearchOutline } from "flowbite-svelte-icons";
    import { Link, navigate } from "svelte-navigator";
  import IconW from "./IconW.svelte";
  
    export let transactionDetails;
    let goldPrice = null
    let silverPrice = null


    async function getPrices(){
    let res = await fetch('http://localhost:3000/current-gold-silver-price')
    let data = await res.json()
    console.log(data)
    goldPrice = data.goldPrice.prices[0]
    silverPrice = data.silverPrice.prices[0]
  }
  getPrices()
  
    let searchTerm = '';
  
  </script>
  
  <Card class="w-full max-w-none">
    <div class="flex items-center gap-4 justify-between mb-3">
      <h1 class="text-2xl text-black flex gap-3 items-center">
        <ChartMixedSolid class="w-6 h-6 text-slate-700" />
        Portfolio
      </h1>
      <div class="search w-64">
        <Input bind:value={searchTerm} id="email" type="email" placeholder="Search..." size="md">
          <SearchOutline slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Input>
      </div>
    </div>
    {#if transactionDetails}
      <Table>
        <TableHead>
          <TableHeadCell>NAME</TableHeadCell>
          <TableHeadCell>quantity</TableHeadCell>
          <TableHeadCell>Amount</TableHeadCell>
          <TableHeadCell>Sell</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">

          <TableBodyRow>
              <TableBodyCell>
                <div class="wrap flex gap-3 items-center">
                    <IconW icon={"mdi:gold"}  style="font-size:25px; color:gold" />
                    Gold
                </div>
            </TableBodyCell>
              <TableBodyCell>{transactionDetails.goldPortfolio.amountInTola}</TableBodyCell>
              <TableBodyCell>{(transactionDetails.goldPortfolio.amountInTola * goldPrice).toFixed(2)}</TableBodyCell>
              <TableBodyCell>
                <button class="bg-green-600 text-white px-4 py-2 rounded-md" on:click={()=>{
                    navigate("/transfer/buyOrSell")
                }}>Sell</button>
              </TableBodyCell>
            </TableBodyRow>
            <TableBodyRow>
                <TableBodyCell>
                    <div class="wrap flex gap-3 items-center">
                        <IconW icon={"mdi:gold"}  style="font-size:25px; color:silver" />
                        Silver
                    </div>
                </TableBodyCell>
                <TableBodyCell>{transactionDetails.silverPortfolio.amountInTola}</TableBodyCell>
                <TableBodyCell>{(transactionDetails.silverPortfolio.amountInTola * silverPrice).toFixed(2)}</TableBodyCell>
                <TableBodyCell>
                  <button class="bg-green-600 text-white px-4 py-2 rounded-md" on:click={()=>{
                    navigate("/transfer/buyOrSell")
                  }}>Sell</button>
                </TableBodyCell>
          </TableBodyRow>
          {#each transactionDetails.realStatePortfolio as t }
          {#if t.numberOfShares != 0}
          <TableBodyRow>
            <TableBodyCell>
                <div class="wrap flex gap-3 items-center">
                    <IconW icon={"mdi:home"}  style="font-size:25px; color:gray" />
                    <Link to="/realstateView/{t.info._id}" class="text-blue-600 hover:underline">
                        
                        {t.info.username}</Link>
                </div>
            </TableBodyCell>
                <TableBodyCell>{t.numberOfShares}</TableBodyCell>
                <TableBodyCell>{t.info.currentValuationPerShare}</TableBodyCell>
                <TableBodyCell>
                    <button class="bg-green-600 text-white px-4 py-2 rounded-md" on:click={()=>{
                      navigate(`/transfer/buyOrSell/${t.info._id}`)
                    }}>Sell</button>
                  </TableBodyCell>
            </TableBodyRow>
                {/if}
          {/each}
        </TableBody>
      </Table>
    {:else}
      <p class="text-gray-500">No transactions found.</p>
    {/if}
  </Card>
  