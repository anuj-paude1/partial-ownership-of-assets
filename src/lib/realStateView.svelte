<script>

  import Icon from "@iconify/svelte";
  import { Link, useParams } from "svelte-navigator";
  import ImageScroll from "../components/imageScroll.svelte";
  import { Button, Carousel, Skeleton, VideoPlaceholder } from 'flowbite-svelte';
  import MapView from "../components/MapView.svelte";
  import RealStateTab from "../components/RealStateTab.svelte";
  import { parse } from "svelte/compiler";
  let p = useParams()
  let id = $p.id
  function arrayBufferToBase64(buffer) {
    let binary = '';
    buffer.forEach((byte) => binary += String.fromCharCode(byte));
    return btoa(binary);
  }
  let data = getRealState()
  async function getRealState(){
    let res = await fetch(`http://localhost:3000/realestatedata/${id}`)
    let data = await res.json()
    console.log(data)
    updateImage(data.image)
    return data
  }
   let images = []
  const updateImage = (dataI)=>{
    dataI.forEach(element => {
        const imageArray = new Uint8Array(element.data.data);

      images.push({src: `data:image/jpeg;base64,${arrayBufferToBase64(imageArray)}`, alt: 'Phone Mockup'})
    });
    console.log(images)

      
  }
          
      
    let index = 0;
    let image;
</script>
<div class="content p-10 w-full h-screen overflow-y-auto flex flex-col gap-10 pb-40">
<div class="top w-full items-center">
    <Link to="/realstate" class="text-black w-10 h-10 flex items-center justify-center rounded-full text-2xl bg-white">
        <Icon icon="lets-icons:back" />        
    </Link>
    <div class="detail mt-10  flex w-max  mx-auto items-center gap-10 ml-32">
          <div class="max-w-4xl space-y-4 w-[400px]">
            {#await data}
            <VideoPlaceholder />
            {:then data}
            <Carousel imgClass="image" {images}  let:Controls>
                <Controls  />
              </Carousel>
            {/await}
          </div>
          <div class="desc text-white ml-10 flex flex-col gap-4">
            {#await data}
            <Skeleton size="md" class="my-8 w-48" />

            {:then data} 
            <h1 class="text-3xl font-semibold">Details</h1>
            <p class="text-lg font-semibold">Identity :  <span class="text-slate-300">{data.username}</span></p>
            <p class="text-lg font-semibold">Location :  <span class="text-slate-300">{data.location}</span></p>
            <p class="text-lg font-semibold">Property Type :  <span class="text-slate-300">{data.revenueDetails}</span></p>
            <p class="text-lg font-semibold">Market Capitalization : <span class="text-slate-300"> Rs {data.revenue}</span></p>
            <p class="text-lg font-semibold">Floating Share :  <span class="text-slate-300">{data.totalShareCount}</span></p>
            <p class="text-lg font-semibold">Monthly Dividend Amount : <span class="text-slate-300">{parseFloat(data.revenue) / parseFloat(data.totalShareCount)}</span></p>
            {/await}
          </div>
    </div>
</div>
<div class="mid w-full flex ml-[130px]">
    {#await data}
        <VideoPlaceholder divClass="margin-l"/>
    {:then data}
    <MapView lat={data.lat} long={data.long} />
    {/await}
    <div class="desc w-1/2 text-white flex flex-col gap-4 ml-20">
        {#await data}
            <Skeleton size="md" class="my-8" />
        {:then data}
        <p class="text-lg font-semibold">Property Size : <span class="text-slate-300">{data.propertySize}</span></p>
        <p class="text-lg font-semibold">Structure Details :  <span class="text-slate-300">{data.structureDetails}</span></p>
        <p class="text-lg font-semibold">Year Built  :  <span class="text-slate-300">{data.yearBuilt} B.S</span></p>
        <p class="text-lg font-semibold">Accessibility Features: <p class="text-slate-300 flex flex-col">
            {#each data.accessibilityFeatures as feature}
                <p>{feature}</p>
            {/each}
        </p>
        {/await}
        <div class="actions flex items-center gap-4">
            <div class="text-3xl rounded-full ">
                <Icon icon="mdi:cart" />
            </div>
            <div class="text-red-600">
                <Icon icon="mdi:heart" />
            </div>
            <Link to={`/transfer/buyOrSell/${id}`}>
            <Button>
                Buy
            </Button>
            </Link>
        </div>
    </div>
</div>
<div class="base mx-20">
    <RealStateTab />
</div>
</div>


<style>
:global(.image){
    border-radius: 50px;
    
}
:global(.margin-l){
    margin-left: 10px;
    background-color: rgba(219, 219, 219, 0.5);
    border-radius: 10px;
    width:380px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>