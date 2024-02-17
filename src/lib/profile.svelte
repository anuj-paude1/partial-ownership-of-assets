<script lang="ts">
  import { Avatar, Card, Heading, Input } from "flowbite-svelte";
  import UserData from "../components/userData.svelte";
  import RealStateInvesment from "../components/realStateInvesment.svelte";
  import GoldInvesment from "../components/goldInvesment.svelte";
  import { SearchOutline } from "flowbite-svelte-icons";
  import Transaction from "../components/Transaction.svelte";
  import { onMount } from 'svelte';
  import { user } from "../store";

  let userInfo;

  onMount(async () => {
    userInfo = await getUserInfo();
  });

  async function getUserInfo() {
    if ($user) {
      const response = await fetch(`http://localhost:3000/getuserinfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: $user.username, password: $user.password }),
      });
      let data = await response.json();
      return data;
    }
    return null;
  }
</script>

<div class="content p-10 w-full h-screen overflow-y-auto pb-40">
  <div class="top flex justify-around gap-20 mb-10">
    <div class="pp flex flex-col text-white text-2xl gap-10 -mt-10 ml-10">
      <p class="whitespace-nowrap">User Profile</p>
      <img src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user" class="rounded-full" />
    </div>
    <Card class="w-full max-w-none">
      {#if userInfo}
        <UserData {userInfo} />
      {:else}
        <p>Loading...</p>
      {/if}
    </Card>
  </div>
  <!-- {#if userInfo}
    <Transaction transactionDetails={userInfo.transactionDetails}  />
  {/if} -->
</div>
