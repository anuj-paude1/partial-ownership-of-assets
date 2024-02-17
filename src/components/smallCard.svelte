<script>

  import { Card } from "flowbite-svelte";
 import {WalletOutline,DotsVerticalOutline} from "flowbite-svelte-icons"
  import { showModalFn } from "../store";
 export let LogoComp = WalletOutline;
 export let title = "Investment";
 export let value = "Rs 632.0";
 export let percentage;
 export let type;

</script>
<Card class="w-full bg-white">
    <div class="top flex justify-between items-center">
         <div class="px-4 bg-orange-200 py-4 rounded-full"><LogoComp class="w-4 h-4 text-orange-400" /></div>
         <div class="px-4 py-4 rounded-full hover:bg-slate-200 cursor-pointer">
            <DotsVerticalOutline class="w-4 h-4 text-slate-700"/>
         </div>
    </div>
    <div class="bottom mt-5">
        <div class="title font-semibold">{title}</div>
        <div class="value flex justify-between items-center">
            <p class="text-xl font-bold">{value}</p>
            {#if type != "loadMoney"}
            {#if percentage}
            <span class="bg-green-200 p-1 rounded-xl px-4">{percentage}</span>
            {/if}
            {:else}
            <span on:click={()=>{
                showModalFn()
            }} class="bg-green-200 p-1 rounded-xl px-4 hover:bg-green-300 cursor-pointer">Load Money</span>
            {/if}
        </div>
    </div>

</Card>