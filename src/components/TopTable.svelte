<script>
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
  import { useParams } from 'svelte-navigator';
    let searchTerm = '';
    let p = useParams()
    let id = $p.id
    let getTransaction = async () => {
        let res = await fetch(`http://localhost:3000/getTransaction/${id}`);
        let data = await res.json();
        console.log(data)
        return data
    }
    let data = getTransaction()
    export let items = [
      { id: 1, QTY: 'ABC', PRICE: 2017 },
      { id: 2, QTY: 'CDE', PRICE: 2018 },
      { id: 3, QTY: 'FGH', PRICE: 2019 },
      { id: 4, QTY: 'IJK', PRICE: 2020 }
    ];
  </script>
  
  <Table hoverable={true}>
    <TableHead>
      <TableHeadCell>Qty</TableHeadCell>
      <TableHeadCell>Price</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
        {#await data}   
        {:then data}             
            {#each data.details as item}
            <TableBodyRow>
                <TableBodyCell>{item.numberOfShares}</TableBodyCell>
                <TableBodyCell>{data.price}</TableBodyCell>
            </TableBodyRow>
            {/each}
        {/await}
    </TableBody>
</Table>