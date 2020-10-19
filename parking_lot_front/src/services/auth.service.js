import axios from "axios";

const API_URL = "http://localhost:8102/parking_lot/auth/";

const register = (username, email, password) => {
  var authorities=['user']
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
    authorities,
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "login", {
      username,
      password,
    })
    .then((response) => {
      console.log(response.data)
      if (response.data.access_token) {
        console.log("reached")
        var token=JSON.parse(atob(response.data.access_token.split('.')[1]))

        console.log(token.scopes.map((role) => role.split(',')[1].split('=')[1].slice(0,-1)))
        var obj={'username':token.sub,'roles':token.scopes.map((role) => role.split(',')[1].split('=')[1].slice(0,-1)), 'accessToken':response.data.access_token}

        localStorage.setItem("user", JSON.stringify(obj));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  // var user= JSON.parse(localStorage.getItem("user"))
  // console.log(user)
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};
