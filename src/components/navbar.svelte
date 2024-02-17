<script lang="ts">
      import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar } from 'flowbite-svelte'
  import { Link } from 'svelte-navigator';
  import UserAvatar from './UserAvatar.svelte';
  

</script>

<nav class="h-20 ml-auto flex items-center justify-end pr-16">
    <ul class="">
      <li class="ml-auto">
        <UserAvatar />
      </li>
    </ul>
  </nav>