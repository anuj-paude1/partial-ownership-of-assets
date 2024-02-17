<script>
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
  import { useParams } from 'svelte-navigator';
    let searchTerm = '';
    let p = useParams()
    let id = $p.id
    const fetchPendingOrder = async () => {
        let res = await fetch(`http://localhost:3000/getPendingSelling/${id}/`);
        let data = await res.json();
        let res2 = await fetch(`http://localhost:3000/getPendingBuying/${id}/`);
        let data2 = await res2.json();
        if(data.error || data2.error){
        }else{
            console.log({...data, ...data2})
            return {...data, ...data2}
        }
    }
    let Tdata = fetchPendingOrder()

    fetchPendingOrder()
    export let items = [
      { id: 1, type: 'ABC', qty: 2017, price: 200, remQty: 10, value: 3280 },
    ];
  </script>
  
  <Table hoverable={true}>
    <TableHead>
        <TableHeadCell>Type</TableHeadCell>
        <TableHeadCell>Qty</TableHeadCell>
      <TableHeadCell>Price</TableHeadCell>

    </TableHead>
    <TableBody tableBodyClass="divide-y">
      {#each items as item}
      {#await Tdata}
      {:then Tdata } 
      {#each Tdata.pendingToBeSold? Tdata.pendingToBeSold : [] as  item }
      <TableBodyRow>
                <TableBodyCell>Selling</TableBodyCell>
                <TableBodyCell>{item.numberOfShares}</TableBodyCell>
                <TableBodyCell>{item.sellingPricePerShare}</TableBodyCell>
            </TableBodyRow>
            {/each}
            {#each Tdata.pendingToBeBought? Tdata.pendingToBeBought : [] as  item }
            <TableBodyRow>
                <TableBodyCell>Buying</TableBodyCell>
                <TableBodyCell>{item.numberOfShares}</TableBodyCell>
                <TableBodyCell>{item.buyingPricePerShare}</TableBodyCell>
            </TableBodyRow>
            {/each}
            {/await}
      {/each}
    </TableBody>
</Table>