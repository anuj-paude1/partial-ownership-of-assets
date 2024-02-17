<script>
    import { Carousel } from 'flowbite-svelte';
    export let images
    // const images = [
    //   {
    //     src: '../../public/images/1.jpg',
    //     alt: 'Phone Mockup',
    //   },
    //   {
    //     src: '../../public/images/2.jpg',
    //     alt: 'Phone Mockup',
    //   },
    //   {
    //     src: '../../public/images/3.jpg',
    //     alt: 'Phone Mockup',
    //   }
    // ];
  
    let index = 0;
    let image;
  </script>
  
  <div class="max-w-4xl space-y-4 w-full h-56">
    <Carousel imgClass="h-56 object-cover" {images}   let:Controls>
        <Controls  />
    </Carousel>
  </div>