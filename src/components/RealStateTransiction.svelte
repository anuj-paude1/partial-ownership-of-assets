<script lang="ts">
    import { Card, Input, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from "flowbite-svelte";
    import { ChartMixedSolid, SearchOutline } from "flowbite-svelte-icons";
    import { Link } from "svelte-navigator";
  
    export let transactionDetails;
  
    let searchTerm = '';
    let filteredItems = transactionDetails

    $: {
        filteredItems = transactionDetails
        console.log(filteredItems)

    }
    // $: filteredItems = ((!transactionDetails || !transactionDetails.length ) || [])
  </script>
  
  <Card class="w-full max-w-none">
    <div class="flex items-center gap-4 justify-between mb-3">
      <h1 class="text-2xl text-black flex gap-3 items-center">
        <ChartMixedSolid class="w-6 h-6 text-slate-700" />
        Transaction
      </h1>
      <div class="search w-64">
        <Input bind:value={searchTerm} id="email" type="email" placeholder="Search..." size="md">
          <SearchOutline slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Input>
      </div>
    </div>
    {#if filteredItems && filteredItems.length > 0}
      <Table>
        <TableHead>
          <TableHeadCell>TRANSACTIONTIME</TableHeadCell>
          <TableHeadCell>NUMBEROFSHARES</TableHeadCell>
          <TableHeadCell>BUYINGUSER</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#each filteredItems as item}
            <TableBodyRow>
              <TableBodyCell>{item.transactionTime}</TableBodyCell>
              <TableBodyCell>{item.numberOfShares}</TableBodyCell>
              <TableBodyCell>{item.buyingUser}</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    {:else}
      <p class="text-gray-500">No transactions found.</p>
    {/if}
  </Card>
  
