<script lang="ts">
  import { Route, Router, useLocation, useNavigate } from "svelte-navigator";

  import Dashboard from "./dashboard.svelte";
  import Profile from "./profile.svelte";
  import Contact from "./contact.svelte";
  import Login from "./login.svelte";
  import Register from "./register.svelte";
  import Sidebar from "../components/sidebar.svelte";
  import Navbar from "../components/navbar.svelte";
  import { isLoggedIn, login, user, showModal, loadRealState } from "../store";
  import History from "./history.svelte";
  import RealState from "./realState.svelte";
  import GoldOrSilver from "./goldOrSilver.svelte";
  import RealStateView from "./realStateView.svelte";
  import Transfer from "./Transfer.svelte";
  import { Button, Modal } from 'flowbite-svelte';
  import connectIps from "../../public/images/logo_connectIPS.png"
  import MarketStat from "./marketStat.svelte";

  const navigate = useNavigate();
  const location = useLocation();


    $:{
        if(!isLoggedIn() && $location.pathname != "/register"){
            navigate("/login", { replace: true });
        }
    }

</script>
    <main class={`flex min-h-screen ${$user ? "": " items-center justify-center"}`}>
          <Modal title="Load Wallet" bind:open={$showModal} autoclose>
            <img src={connectIps} alt="Provider" class="mx-auto h-28" />
            <svelte:fragment slot="footer">
              <Button on:click={() => alert('Handle "success"')}>Load</Button>
              <Button color="alternative">Decline</Button>
            </svelte:fragment>
          </Modal>
        {#if $user}
        <Sidebar />
        {/if}
<div class="w-full">
    {#if $user}
    <Navbar />
    {/if}
    <Route path="/" component={Dashboard} />
    <Route path="/realstateView/:id" component={RealStateView} />
    <Route path="/profile" component={Profile} />
    <Route path="/history" component={History} />
    <Route path="/goldOrSilver" component={GoldOrSilver} />
    <Route path="/realstate" component={RealState} />
    <Route path="/contact" component={Contact} />
    <Route path="/login" component={Login} />
    <Route path="/marketStats" component={MarketStat} />

    <Route path="/register" component={Register} />
    <Route path="/transfer/buyOrSell/*">
        <Route path="/:id" let:params>
            <Transfer q={params} />
        </Route>
        <Route path="/" component={Transfer} />
    </Route>
</div>
    </main>
