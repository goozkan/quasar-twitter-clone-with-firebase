import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEtgSdaPZ1aK5ZdmS6s1qeKK62I6NX0zM",

  authDomain: "qweetter-7740a.firebaseapp.com",

  projectId: "qweetter-7740a",

  storageBucket: "qweetter-7740a.appspot.com",

  messagingSenderId: "1042758701684",

  appId: "1:1042758701684:web:5e448cc5fef1fbe16ff721"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Get a list of qweets from your database
/*async function getQweets(db) {
  const qweetCol = collection(db, "qweets");
  const qweetSnapshot = await getDocs(qweetCol);
  const qweetsList = qweetSnapshot.docs.map((doc) => doc.data());
  return qweetsList;
}*/
