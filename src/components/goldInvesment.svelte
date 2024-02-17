<script>
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
    let searchTerm = '';
    let items = [
      { price: 1500, marketPrice: 1800, invested: 100, current: 200, profit: 100 },
      { price: 2000, marketPrice: 2200, invested: 300, current: 400, profit: 100 },
      { price: 2500, marketPrice: 2700, invested: 500, current: 600, profit: 100 },
      { price: 3000, marketPrice: 3200, invested: 700, current: 800, profit: 100 }
    ];
  </script>
  
  <Table hoverable={true}>
    <TableHead>
      <TableHeadCell>Price</TableHeadCell>
      <TableHeadCell>Market Price</TableHeadCell>
      <TableHeadCell>Invested</TableHeadCell>
      <TableHeadCell>Current</TableHeadCell>
      <TableHeadCell>Profit</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
      {#each items as item}
        <TableBodyRow>
          <TableBodyCell>{item.price}</TableBodyCell>
          <TableBodyCell>{item.marketPrice}</TableBodyCell>
          <TableBodyCell>{item.invested}</TableBodyCell>
          <TableBodyCell>{item.current}</TableBodyCell>
          <TableBodyCell>{item.profit}</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
</Table>