// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// export const firebaseConfig = {
//   apiKey: "AIzaSyACboX02F_rqUkKaujjTtDTBpN4f0Y5DgA",
//   authDomain: "weather-a9d89.firebaseapp.com",
//   projectId: "weather-a9d89",
//   storageBucket: "weather-a9d89.firebasestorage.app",
//   messagingSenderId: "509174513585",
//   appId: "1:509174513585:web:110fab94df46c3d2074790",
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);

// export default app;

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyAtLjcBuhWqSjt7HUEOe1p1a91gRBTi4kE",
  authDomain: "chocokart-ee033.firebaseapp.com",
  projectId: "chocokart-ee033",
  storageBucket: "chocokart-ee033.appspot.com",
  messagingSenderId: "832109864732",
  appId: "1:832109864732:web:e1e7089f8f4caa2482fcd9",
  measurementId: "G-016L7KVFMV",
  databaseURL: "https://chocokart-ee033-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
