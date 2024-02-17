<script>
  import Icon from "@iconify/svelte";

        export let icon = "mdi:gold";
        export let style;
</script>

<div {style}>
    <Icon {icon} />
</div>
