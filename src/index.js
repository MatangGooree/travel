import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import 'firebase/auth';

import { Provider } from "react-redux"; // Provider를 import
import store from '../src/store.js' //경로설정
 
  

const firebaseConfig = {
  apiKey: "AIzaSyDhl39u_5WKV3Zlm32QG6ljnQlgzFzsC2g",
  authDomain: "travel-c9694.firebaseapp.com",
  projectId: "travel-c9694",
  storageBucket: "travel-c9694.appspot.com",
  messagingSenderId: "368250856006",
  appId: "1:368250856006:web:7d4cf4644dd2f4a89ca047",
  measurementId: "G-W62806KKR8"
};

firebase.initializeApp(firebaseConfig);




export const db = firebase.firestore();
export const storageRef = firebase.storage().ref();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider> 
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
