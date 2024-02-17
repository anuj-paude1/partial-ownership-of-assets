<script>
    import { Card, Button } from 'flowbite-svelte';
  import ImageScroll from './imageScroll.svelte';
  import { Link } from 'svelte-navigator';
  export let items;
  let shareCount = items.soldShareCount
  let totalShareCount = items.totalShareCount
  let PropertyUsername = items.username
  let percentage = (shareCount/totalShareCount)*100
  function arrayBufferToBase64(buffer) {
    let binary = '';
    buffer.forEach((byte) => binary += String.fromCharCode(byte));
    return btoa(binary);
  }
  let images = []
  const updateImage = (dataI)=>{
    dataI.forEach(element => {
        const imageArray = new Uint8Array(element.data.data);

      images.push({src: `data:image/jpeg;base64,${arrayBufferToBase64(imageArray)}`, alt: 'Phone Mockup'})
    });
}
updateImage(items.image)
</script>
  
  <Card padding="none" class="w-Wfull max-w-[280px] max-h-[440px]">
    <div class="img overflow-hidden h-56">
        <ImageScroll {images}/>
    </div>
        <div class="detail px-3 py-3 flex flex-col gap-3">
            <p class="text-end">Valuation: Rs {items.currentValuationPerShare * totalShareCount}</p>
            <div class="w-full bg-slate-200 h-2 rounded-full">
                <span class="h-full bg-blue-500 rounded-full block" style={`width:${percentage}%`}></span>
            </div>
            <div class="address flex flex-col">
                <p class="font-bold text-2xl">{items.username}</p>
                <p class="font-bold">{items.location}</p>
                <span class="text-blue-700">{items.structureDetails}</span>
                <span>Rs {items.revenue}</span>

            </div>
            <div class="actions flex justify-between items-center">
                <span class="text-green-500 text-center font-semibold text-xl">Rs {items.currentValuationPerShare}</span>
                <Link to={`/realstateView/${items._id}`}><Button color="blue">View More </Button></Link>
            </div>
        </div>
  </Card>