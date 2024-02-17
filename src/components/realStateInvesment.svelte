<script>
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
    let searchTerm = '';
    let items = [
      { propertyLogo: 1, type: 'ABC', initial: 'Toyota', share: 2017, quantity: 10 },
      { propertyLogo: 2, type: 'CDE', initial: 'Ford', share: 2018, quantity: 15 },
      { propertyLogo: 3, type: 'FGH', initial: 'Volvo', share: 2019, quantity: 20 },
      { propertyLogo: 4, type: 'IJK', initial: 'Saab', share: 2020, quantity: 25 }
    ];
    $: filteredItems = items.filter((item) => item.initial.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
  </script>
  
  <TableSearch placeholder="Search by maker name" hoverable={true} bind:inputValue={searchTerm}>
    <TableHead>
      <TableHeadCell>PropertyLogo</TableHeadCell>
      <TableHeadCell>Type</TableHeadCell>
      <TableHeadCell>Initial</TableHeadCell>
      <TableHeadCell>Share</TableHeadCell>
      <TableHeadCell>Quantity</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
      {#each filteredItems as item}
        <TableBodyRow>
          <TableBodyCell>{item.propertyLogo}</TableBodyCell>
          <TableBodyCell>{item.type}</TableBodyCell>
          <TableBodyCell>{item.initial}</TableBodyCell>
          <TableBodyCell>{item.share}</TableBodyCell>
          <TableBodyCell>{item.quantity}</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </TableSearch>