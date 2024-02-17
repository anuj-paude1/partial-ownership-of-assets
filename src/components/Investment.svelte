<script>

    import { Card, Input, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from "flowbite-svelte";
    import GoldInvesment from "./goldInvesment.svelte";
    import RealStateInvesment from "./realStateInvesment.svelte";
    import UserData from "./userData.svelte";
    import Icon from '@iconify/svelte';
    let type;
    export let transictionData = []

    import { ChartMixedSolid, SearchOutline } from "flowbite-svelte-icons";
  import { useParams } from "svelte-navigator";
  import { user } from "../store";
      let searchTerm = '';
      let items = [
        { propertyLogo: 1, type: 'ABC', initial: 'Toyota', share: 2017, quantity: 10 },
        { propertyLogo: 2, type: 'CDE', initial: 'Ford', share: 2018, quantity: 15 },
        { propertyLogo: 3, type: 'FGH', initial: 'Volvo', share: 2019, quantity: 20 },
        { propertyLogo: 4, type: 'IJK', initial: 'Saab', share: 2020, quantity: 25 }
      ];
      $: filteredItems = items.filter((item) => item.initial.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
  
  </script>
  <Card class="w-full max-w-none">
      <div class="flex items-center gap-4 justify-between mb-3">
          <h1 class="text-2xl font-semibold flex gap-3 items-center text-blue-500">
              <div class="icon text-white rounded-full bg-yellow-300 p-2 text-lg">
                <Icon icon="mdi:gold" class="-translate-y-0.5" />
              </div>
              Transaction
          </h1>
          <div class="search w-64">
              <Input bind:value={searchTerm} id="email" type="email" placeholder="Search..." size="md">
                  <SearchOutline slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </Input>
          </div>
  
      </div>
      <Table>
          <TableHead>
            <TableHeadCell>PropertyLogo</TableHeadCell>
            <TableHeadCell>Time</TableHeadCell>
            <TableHeadCell>Amount</TableHeadCell>
            <TableHeadCell>Price</TableHeadCell>
          </TableHead>
          <TableBody tableBodyClass="divide-y">
            {#await transictionData}
            {:then transictionData} 
              {#each transictionData as item}
                  <TableBodyRow>
                    <TableBodyCell>
                      {#if item.gold}
                      <div class="text-2xl text-orange-500">
                        <Icon icon="mdi:gold"/>

                      </div>
                      {:else}
                      <div class="text-2xl text-slate-400">
                        <Icon icon="mdi:gold"/>
                      </div>
                      {/if}
                    </TableBodyCell>
                    
                    <TableBodyCell>{item.transactionTime}</TableBodyCell>
                    <TableBodyCell >
                      <span class={"p-1 px-3 rounded-sm " + (parseFloat(item.amount) >= 0 ? 'bg-green-500' : 'bg-red-500')}>{item.amount}</span>
                      </TableBodyCell>
                    <TableBodyCell>{item.price}</TableBodyCell>

                  </TableBodyRow>
              {/each}
            {/await}
          </TableBody>
        </Table>
  </Card>