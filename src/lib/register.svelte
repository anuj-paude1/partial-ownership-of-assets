<script lang="ts">
  import { Input, Label, Helper, Button, Checkbox, A, Card, Alert } from 'flowbite-svelte';
  import { signup } from '../store';
  import img from "../../public/logo.jpg"
  import { useNavigate } from 'svelte-navigator';

  let firstName = '';
  let lastName = '';
  let citizenshipNumber = '';
  let email = '';
  let username = '';
  let password = '';
  let confirm_password = '';
  let gender = '';
  let fatherOrMotherName = '';
  let address = '';
  let contactNumber = '';
  let terms = false;
  let isError: boolean | null = null;
  let error = '';

  let navigate = useNavigate();

  const showError = (message: string) => {
    isError = true;
    error = message;
  };

  const hideError = () => {
    isError = false;
    error = '';
  };

  const handleSubmit = async () => {
    hideError();
    if (
      firstName.trim() === '' ||
      lastName.trim() === '' ||
      citizenshipNumber.trim() === '' ||
      email.trim() === '' ||
      username.trim() === '' ||
      password.trim() === '' ||
      confirm_password.trim() === '' ||
      gender.trim() === '' ||
      fatherOrMotherName.trim() === '' ||
      address.trim() === '' ||
      contactNumber.trim() === ''
    ) {
      showError('Please fill in all fields.');
    } else {
      if (password !== confirm_password) {
        showError('Passwords do not match.');
      } else {
        let res = await signup(username, password, firstName, lastName, citizenshipNumber, email, gender, fatherOrMotherName, address, contactNumber)
        if (!res.error) {
          navigate('/', { replace: true });
        }else{
            showError(res.message);
        }
      }
    }
  };
  </script>
  <Card class="max-w-4xl w-full mx-auto">
    <div class="absolute top-3 left-1/2 -translate-x-1/2">
      <img src={img} alt="logo" />
  </div>
    {#if isError}
        <Alert color="red">{error}</Alert>
    {/if}
        <div>
            <div class="grid gap-1 mb-1 md:grid-cols-3">
              <div>
                <Label for="first_name" class="mb-2">First name</Label>
                <Input type="text" id="first_name" placeholder="John" required bind:value={firstName} />
              </div>
              <div>
                <Label for="last_name" class="mb-2">Last name</Label>
                <Input type="text" id="last_name" placeholder="Doe" required bind:value={lastName} />
              </div>
              <div>
                <Label for="phone" class="mb-2">CitizenShip No.</Label>
                <Input type="tel" id="phone" placeholder="123-45-678" required bind:value={citizenshipNumber} />
              </div>
              <div class="mb-6">
                <Label for="gender" class="mb-2">Gender</Label>
                <Input type="text" id="gender" placeholder="Male/Female" required bind:value={gender} />
              </div>
          
              <div class="mb-6">
                <Label for="fatherOrMotherName" class="mb-2">Father/Mother Name</Label>
                <Input type="text" id="fatherOrMotherName" placeholder="John Doe" required bind:value={fatherOrMotherName} />
              </div>
          
              <div class="mb-6">
                <Label for="address" class="mb-2">Address</Label>
                <Input type="text" id="address" placeholder="123 Main St, City" required bind:value={address} />
              </div>
          
              <div class="mb-6">
                <Label for="contactNumber" class="mb-2">Contact Number</Label>
                <Input type="tel" id="contactNumber" placeholder="123-456-7890" required bind:value={contactNumber} />
              </div>
              <div class="mb-6">
                <Label for="email" class="mb-2">Email address</Label>
                <Input type="email" id="email" placeholder="john.doe@company.com" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" required bind:value={email} />
              </div>
              <div class="mb-6">
                  <Label for="username" class="mb-2">username</Label>
                  <Input type="text" id="username" placeholder="eg. john" required bind:value={username} />
                </div>
              <div class="mb-6">
                <Label for="password" class="mb-2">Password</Label>
                <Input type="password" id="password" placeholder="•••••••••" required bind:value={password} />
              </div>
              <div class="mb-6">
                <Label for="confirm_password" class="mb-2">Confirm password</Label>
                <Input type="password" id="confirm_password" placeholder="•••••••••" required bind:value={confirm_password} />
              </div>
            </div>
            <Checkbox class="mb-6 space-x-1 rtl:space-x-reverse" required bind:checked={terms}>
              I agree with the <A href="/" class="text-primary-700 dark:text-primary-600 hover:underline">terms and conditions</A>.
            </Checkbox>
            <Button type="button" on:click={handleSubmit}>Submit</Button>
          </div>
  </Card>