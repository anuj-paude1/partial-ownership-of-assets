<script>
    import { Avatar, Indicator } from 'flowbite-svelte';
  import { Link } from 'svelte-navigator';
  import { user, cash, getCash } from '../store';



  getCash()
  </script>
  
<div class="view flex items-center gap-5 ml-auto">
    <Avatar dot={{ color: 'green' }} />
    <div class="detail text-white">
        <h4 class="text-lg font-semibold">
            <Link to="/profile">{$user.username}</Link>
        </h4>
        <span class="text-sm text-green-400 font-semibold m-0">Rs. {$cash.toFixed(2)}</span>
    </div>
</div>
