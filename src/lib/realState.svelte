<script>

    import { Input } from "flowbite-svelte";
    import { SearchOutline } from "flowbite-svelte-icons";
    import RealStateCard from "../components/RealStateCard.svelte";
    import { CardPlaceholder } from 'flowbite-svelte';
    import { realStateStore } from "../store";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";


    let realState;
    onMount(()=>{
        if($realStateStore.length == 0){
        realState = getRealStates();
        realState.then(data => realStateStore.set(data))
    }else{
        realState = $realStateStore
    }
    async function getRealStates(){
        let res = await fetch('http://localhost:3000/getallrealestate')
        let data = await res.json()
        return data;
    }
    })
  
  </script>
  <div class="content p-10 w-full overflow-y-auto flex flex-col h-screen gap-10 box-border">
      <div class="top flex  justify-between items-center">
          <h1 class="text-white text-lg">Real State</h1>
          <div class="search w-64">
              <Input id="email" type="email" placeholder="Search..." size="md">
                  <SearchOutline slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </Input>
          </div>
      </div>
      <div class="grid grid-cols-4 gap-6 mt-5 grid-flow-row h-[550px] overflow-auto">
            {#await realState}
            <CardPlaceholder divClass="cardHolder" />
            <CardPlaceholder divClass="cardHolder" />
            <CardPlaceholder divClass="cardHolder" />
        {:then realState}
        {#if realState}
            {#each realState as item}
            <div in:fade={{duration: 800}}>
                <RealStateCard  items={item} />
            </div>
            {/each}
            {/if}
        {/await}
      </div>
  </div>
  