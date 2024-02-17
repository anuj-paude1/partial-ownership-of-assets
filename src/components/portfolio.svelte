<script>

  import { Card } from "flowbite-svelte";
  import { DotsVerticalOutline } from "flowbite-svelte-icons";
  import PortfolioChart from "./portfolioChart.svelte";

</script>

<Card class="w-2/5 max-w-none">
    <!-- <div class="top flex justify-between">
        <h1 class="text-3xl text-black">Portfolio</h1>
        <div class="px-4 py-4 rounded-full hover:bg-slate-200 cursor-pointer">
            <DotsVerticalOutline class="w-4 h-4 text-slate-700"/>
         </div>
    </div> -->
    <PortfolioChart/>
</Card>
