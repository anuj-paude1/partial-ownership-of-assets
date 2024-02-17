<script lang="ts">
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
  import { onMount, createEventDispatcher } from 'svelte';

  export let userInfo;

  let items = [];

  onMount(() => {
    makeData();
  });

  function makeData() {
    items = [
      { type: 'Name', value: userInfo?.firstName || '' },
      { type: 'Gender', value: userInfo?.gender || '' },
      { type: 'Citizenship No.', value: userInfo?.citizenshipNumber || '' },
      { type: 'Father’s/Mother’s Name', value: userInfo?.fatherOrMotherName || '' },
      { type: 'Address', value: userInfo?.address || '' },
      { type: 'Email', value: userInfo?.email || '' },
      { type: 'Contact No.', value: userInfo?.contactNumber || '' },
      { type: 'Account Open Date', value: userInfo?.accountOpenDate || '' },
    ];
  }
</script>

{#if userInfo}
  <Table hoverable={true} divClass="table">
    <TableHead></TableHead>
    <TableBody tableBodyClass="tBody">
      {#each items as item}
        <TableBodyRow>
          <TableBodyCell tdClass="text-lg py-1">{item.type}</TableBodyCell>
          <TableBodyCell tdClass="text-lg py-1">{item.value}</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
{:else}
  <!-- Show a loading indicator or any other content when userInfo is not available -->
  <p>Loading...</p>
{/if}

<style>
  :global(.table) {
    border-radius: 10px;
    overflow: hidden;
  }
</style>
