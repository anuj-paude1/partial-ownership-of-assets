import { useNavigate } from "svelte-navigator";
import { get, writable } from "svelte/store";

export let showModal = writable(false);

export function showModalFn() {
  showModal.set(true);
}
export function hideModalFn() {
  showModal.set(false);
}

export const realStateStore = writable([]);

export const loadRealState = async () => {
  if (get(realStateStore).length == 0) {
    let res = await fetch("http://localhost:3000/getallrealestate");
    let data = await res.json();
    realStateStore.set(data);
  }
};

type userType = {
  username: string;
  password: string;
};

type userProfile = {
  user: userType;
};

export const cash = writable<number>(0);
export let getCash = async () => {
  let res = await fetch(`http://localhost:3000/usercash/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: get(user)?.username,
      password: get(user)?.password,
    }),
  });
  let data = await res.json();
  cash.set(data.cash);
};
export const user = writable<userType | null>(null);

export async function login(username: string, password: string) {
  let res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  let data = await res.text();
  if (data == "User Doesn't Exist") {
    return { error: true, message: data };
  } else {
    let obj = {
      username,
      password,
    };
    user.set(obj);
    saveUserTolocalStorage(obj);
    return { error: false, message: data };
  }
}

export async function signup(
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  citizenshipNumber: string,
  email: string,
  gender: string,
  fatherOrMotherName: string,
  address: string,
  contactNumber: string
) {
  let res = await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      firstName,
      lastName,
      citizenshipNumber,
      email,
      gender,
      fatherOrMotherName,
      address,
      contactNumber,
    }),
  });
  let data = await res.json();
  if (data.type == "error") {
    return { error: true, message: data.message };
  } else if (data.username) {
    let obj = {
      username: data.username,
      password: data.password,
    };
    user.set(obj);
    saveUserTolocalStorage(obj);
    return { error: false, message: data.message };
  } else {
    return { error: true, message: "something went wrong" };
  }
}

const saveUserTolocalStorage = (user: userType) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export function logout() {
  user.set(null);
  localStorage.removeItem("user");
  return true;
}

export const isLoggedIn = () => {
  let userData = get(user);
  if (userData) {
    return true;
  } else {
    if (localStorage.getItem("user")) {
      user.set(JSON.parse(localStorage.getItem("user")!));
      return true;
    } else {
      return false;
    }
  }
};

export async function getUserInfo() {
  if (get(user)) {
    const response = await fetch(`http://localhost:3000/getuserinfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: get(user)?.username,
        password: get(user)?.password,
      }),
    });
    let data = await response.json();
    return data;
  }
  return null;
}
