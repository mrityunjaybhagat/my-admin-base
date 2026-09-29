import { postData } from "./apiAxios.js";

export function login(email, password) {
  return postData("login", { email, password });
}

export function forgotPassword(email) {
  return postData("forgot-password", { email });
}

export function logout() {
  return postData("logout", {});
}
