import { BaseUrl } from "./../Data/config";
import { notify } from "./notification";
import axios from "axios";
import Navigator from "../GlobalNavigation/navigationHistory";

export async function login(code: string) {
  try {
    const response = await axios.get(
      `${BaseUrl}auth/oauth/github?code=${code}`
    );
    if (response?.status === 200) {
      let todayDate = new Date();
      const expirationDate = todayDate.setDate(todayDate.getDate() + 7);
      localStorage.setItem(
        "authData",
        JSON.stringify({
          expirationDate: expirationDate,
          accessToken: response?.data?.access_token,
          loginType: "Github",
        })
      );
      Navigator.push("/dashboard");
    }
  } catch (error) {
    notify(`Error:Something went Wrong`, "error");
    logout();
  }
}

export const setUserName = (userName: string) => {
  let authData = JSON.parse(localStorage.getItem("authData") || "{}");
  authData["userName"] = userName;
  localStorage.setItem("authData", JSON.stringify({ authData }));
};

export function isLogin() {
  let authData = JSON.parse(localStorage.getItem("authData") || "{}");
  if (authData?.["expirationDate"] && authData?.["accessToken"]) {
    let currentDate = new Date();
    let expirationDate = new Date(authData?.["expirationDate"]);
    return expirationDate.getTime() > currentDate.getTime() ? true : false;
  } else {
    logout();
    return false;
  }
}

export async function logout() {
  localStorage.removeItem("authData");
  Navigator.push("/");
}

export function getAccessToken() {
  let message = null;
  if (isLogin()) {
    message = JSON.parse(localStorage?.getItem("authData") || "{}")[
      "accessToken"
    ];
  }
  return message;
}
