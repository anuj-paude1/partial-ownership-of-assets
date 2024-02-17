<script>
    // import { page } from '$app/stores';
    import { Sidebar, SidebarBrand, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
    import { useLocation, useNavigate } from "svelte-navigator";
    import {  UserSolid, DesktopPcSolid, ArrowsRepeatOutline,AdressBookOutline, ArrowLeftOutline, UserSettingsOutline,BookOpenOutline

 } from 'flowbite-svelte-icons';
  import { Link } from 'svelte-navigator';
  import { logout } from '../store';
  import Icon from '@iconify/svelte';
  import IconW from './IconW.svelte';
    const location = useLocation();
    const navigate = useNavigate()
    let activeUrl = $location.pathname
    $: activeUrl = $location.pathname
    let activeClass = 'text-white my-5 flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-400 dark:hover:bg-gray-700';
    let nonActiveClass = 'text-white my-5 flex items-center p-2 text-base font-normal text-white rounded-lg dark:text-white hover:bg-slate-600 dark:hover:bg-green-700';
    let site = {
    name: 'H',
    href: '/',
    img: '../assets/logo.jpg',
  };
  </script>
  
  <Sidebar {activeUrl} {activeClass} {nonActiveClass}>
    <SidebarWrapper divClass="bg-dark text-white p-5 flex flex-col h-screen">
      <SidebarGroup>
        <!-- <SidebarBrand {site} /> -->
        <img src="../../public/logo.jpg" alt="logo" />
        <Link to="/">
          <SidebarItem label="Dashboard" href="/">
            <svelte:fragment slot="icon">
              <DesktopPcSolid class="w-5 h-5" />
            </svelte:fragment>
          </SidebarItem>
        </Link>
        <Link to="/realstate">
          <SidebarItem label="realstate" href="/realstate">
            <svelte:fragment slot="icon">
              <IconW icon="ic:twotone-real-estate-agent" style="font-size:25px"/>
            </svelte:fragment>
          </SidebarItem>
        </Link>
        <Link to="/goldOrSilver">
          <SidebarItem label="Gold / Silver" href="/goldOrSilver">
            <svelte:fragment slot="icon">
              <IconW icon="mdi:gold" style="font-size:25px"/>
            </svelte:fragment>
          </SidebarItem>
        </Link>


        <Link to="/marketStats">
          <SidebarItem label="Market Stats" href="/marketStats">
            <svelte:fragment slot="icon">
              <IconW icon="mdi:chart-line" style="font-size:25px"/>
            </svelte:fragment>
          </SidebarItem>
        </Link>
      </SidebarGroup>
      <hr class="mt-auto"/>
      <SidebarGroup border  borderClass="">
        <Link to="/transfer/buyOrSell">
          <SidebarItem label="Market" href="/transfer/buyOrSell">
            <svelte:fragment slot="icon">
              <BookOpenOutline
              class="w-5 h-5" />
                        </svelte:fragment>
          </SidebarItem>
        </Link>
        <SidebarItem label="Settings" on:click={()=>{
        }}>
        
          <svelte:fragment slot="icon">
            <UserSettingsOutline
            class="w-5 h-5" />
          </svelte:fragment>
        </SidebarItem>
          <SidebarItem label="Logout" on:click={()=>{
            if(logout()){
              navigate("/login", { replace: true })
            }
          }}>
            <svelte:fragment slot="icon">
              <ArrowLeftOutline
              class="w-5 h-5" />
            </svelte:fragment>
          </SidebarItem>
      </SidebarGroup>
    </SidebarWrapper>
  </Sidebar>