import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import * as actionTypes from "./types";

//  Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data
      })
    );
};

//  Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      //  Save token to local storage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);

      //    Set token to auth header
      setAuthToken(token);

      //    Decode token to get user data
      const decoded = jwt_decode(token);

      //    Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set Logged in user
export const setCurrentUser = decoded => {
  return {
    type: actionTypes.SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  //  Remove token from localStorage
  localStorage.removeItem("jwtToken");

  //    Remove auth header for future requests
  setAuthToken(false);

  //    update store
  dispatch(setCurrentUser({}));
};
