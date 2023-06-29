// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import getFirestore function and collection function from firebase
import { getFirestore, collection } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBnwizlcBW3KerUaOE_Hx7VxFw1yLeavC0",
    authDomain: "react-notes-df480.firebaseapp.com",
    projectId: "react-notes-df480",
    storageBucket: "react-notes-df480.appspot.com",
    messagingSenderId: "846716155519",
    appId: "1:846716155519:web:69d655ee667fbcd8a6f14a"
};

//The initializeApp function is imported from the Firebase package. It is used to create and initialize a Firebase application instance with the given configuration object (firebaseConfig). The firebaseConfig object contains information about your Firebase project, such as API key, project ID, and other necessary details. You can obtain this configuration object from your Firebase project's console
const app = initializeApp(firebaseConfig);

//The getFirestore function is imported from the Firestore package (firebase/firestore). This function is used to create a Firestore database instance associated with the initialized Firebase application (app). Firestore is a NoSQL database provided by Firebase to store and sync data for your application (firebase.google.com). "db" typically refers to the database instance that you are working with. The "db" variable is used to interact with the Firestore database and perform operations such as reading and writing data.
//Add "export" so that we can import it in App.jsx
export const db = getFirestore(app);

//The collection function from the firebase/firestore package is used to create a reference to a Firestore collection. In this case, the collection is named "notes". If the collection doesn't exist, Firebase will auto-create. By calling collection(db, "notes"), you are creating a reference to the "notes" collection in the Firestore database (source: thisdot.co). With the notesCollection reference, you can perform various operations on the "notes" collection, such as adding a new document, querying documents, or updating and deleting existing documents.
//Add "export" so that we can import it in App.jsx
export const notesCollection = collection(db, "notes")  