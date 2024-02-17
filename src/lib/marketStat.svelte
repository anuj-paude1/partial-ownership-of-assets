<script>
  import { Table, TableHead, TableHeadCell, TableBody, TableBodyCell, TableBodyRow } from "flowbite-svelte";

    async function getShareInfo(){
        let res = await fetch(`http://localhost:3000/shares-info`)
        let data = await res.json()
        console.log(data)
        return data
    }
    let shareInfo = getShareInfo()
</script>

<div class="content p-10 w-full h-screen overflow-y-auto flex flex-col gap-10 pb-40 text-white">
    <Table hoverable={true}>
        <TableHead>
          <TableHeadCell>
            <div class="text-black font-bold text-xl">
                Identity
            </div>
        </TableHeadCell>
        <TableHeadCell>
            <div class="text-black font-bold text-xl">
                LTP
            </div>
        </TableHeadCell>
        <TableHeadCell>
            <div class="text-black font-bold text-xl">
                Low
            </div>
        </TableHeadCell>
        <TableHeadCell>
            <div class="text-black font-bold text-xl">
                High
            </div>
        </TableHeadCell>
        <TableHeadCell>
            <div class="text-black font-bold text-xl">
                changeInPrice
            </div>
        </TableHeadCell>
        <TableHeadCell>
            <div class="text-black font-bold text-xl">
                Volume
            </div>
        </TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
            {#await shareInfo}   
            {:then shareInfo}             
                {#each shareInfo as item}
                <TableBodyRow color={item.changeInPrice == 0 ? "yellow" : (item.changeInPrice > 0 ? "green" : "red")}>
                    <TableBodyCell tdClass="data">{item.propertyUsername}</TableBodyCell>
                    <TableBodyCell  tdClass="data">{item.lastTradedPrice}</TableBodyCell>
                    <TableBodyCell  tdClass="data">{item.lowestPriceOfDay}</TableBodyCell>
                    <TableBodyCell  tdClass="data">{item.highestPriceOfDay}</TableBodyCell>
                    <TableBodyCell  tdClass="data">{item.changeInPrice}</TableBodyCell>
                    <TableBodyCell  tdClass="data">{item.volumeTradedPerDay}</TableBodyCell>
                </TableBodyRow>
                {/each}
            {/await}
        </TableBody>
    </Table>
</div>

<style>
    :global(.data){
        font-size: 1.25em;
        padding-block: 10px;
        border: 2px solid rgb(227, 227, 227);
        padding-left: 20px;
        color: white;
    }
</style>
