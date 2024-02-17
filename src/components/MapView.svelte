<script lang="ts">
    import L from 'leaflet'
    import 'leaflet/dist/leaflet.css';
  import { onMount } from 'svelte';
  export let lat = 27.6811;
  export let long = 85.3185;
    var mapOptions = {
        center: [lat, long],
        zoom: 16
    }
    onMount(()=>{
        var map = new L.map('map', mapOptions);
        var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
        map.addLayer(layer);
        L.marker([lat, long]).addTo(map)
    })
</script>

<div class="wrapper w-[400px] rounded-lg overflow-hidden">
    <div id="map" style="height: 300px" class="w-full"></div>
</div>