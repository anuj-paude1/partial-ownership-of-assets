<script>
  import Icon from '@iconify/svelte';
    import { Tabs, TabItem } from 'flowbite-svelte';
    import { UserCircleSolid, GridSolid, AdjustmentsVerticalSolid, ClipboardSolid } from 'flowbite-svelte-icons';
    import Transaction from './transaction.svelte';
    import GoldChart from './goldChart.svelte';
    import { onMount } from 'svelte';
  import { useParams } from 'svelte-navigator';
  import RealStateTransiction from './RealStateTransiction.svelte';
  import TransictionChart from './transictionChart.svelte';

  let realEstateData;
  const params = useParams();
  let id = $params.id;

  // Fetch real estate data when the component is mounted
    onMount(async () => {
        const response = await fetch(`http://localhost:3000/realestatedata/${id}`);
        realEstateData = await response.json();
    });

  </script>
  
  <Tabs style="underline">
    <TabItem open>
      <div slot="title" class="flex items-center gap-2 text-slate-200">
        <Icon icon="mdi:chart-line" />
        Price Chart
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400 ">
        <TransictionChart type="Price Chart" />
      </p>
    </TabItem>
    <TabItem>
      <div slot="title" class="flex items-center gap-2 text-slate-200">
        <AdjustmentsVerticalSolid size="sm" />
        Transaction History
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {#if realEstateData}
            <RealStateTransiction transactionDetails={realEstateData.transactionDetails}  />
        {/if}    
    </p>
    </TabItem>
  </Tabs>