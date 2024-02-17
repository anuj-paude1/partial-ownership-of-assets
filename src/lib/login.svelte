<script lang="ts">
    import { Input, Label, Helper, Button, Checkbox, A, Card, Heading, Alert } from 'flowbite-svelte';
  import { Link, useNavigate } from 'svelte-navigator';
  import { login } from '../store';
  import img from "../../public/logo.jpg"
  let username = ''
  let password = ''
  let isError:boolean | null = null
    let error = ""

    let navigate = useNavigate()
    const showError = (message:string) => {
        isError = true
        error = message
    }
    const hideError = () => {
        isError = false
        error = ""
    }
  const handleSubmit = async() => {
    hideError()
    if (username.trim() === '' || password.trim() === '') {
        showError("Please fill in all fields.");
    }else{
        let data = await login(username, password)
        if(!data.error){
            navigate("/", { replace: true })
        }else{
            showError(data.message)
        }
    }
  }

  </script>
<div class="wrapper max-w-3xl mx-auto w-full flex flex-col items-center">
    <div class="absolute top-16">
        <img src={img} alt="logo" />
    </div>
    <h1 class="text-4xl text-center -mt-10 mb-10 font-semibold text-white">Login</h1>
  <Card class=" w-full">
    {#if isError}
    <Alert color="red">{error}</Alert>
{/if}
    <div class="flex flex-col gap-5">
        <div>
            <Label for="username" class="mb-2">username</Label>
            <Input type="text" id="username" placeholder="John" required bind:value={username} />
        </div>
        <div class="mb-6">
        <Label for="password" class="mb-2">Password</Label>
        <Input type="password" id="password" placeholder="•••••••••" required bind:value={password} />
        </div>
        <Button on:click={handleSubmit} type="button">Submit</Button>
        <Link to="/register" class="text-blue-600 text-center hover:underline mt-5 block">Create new account</Link>
    </div>
</Card>
</div>

