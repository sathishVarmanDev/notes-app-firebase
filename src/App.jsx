import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import { nanoid } from "nanoid";
//  onSnapshot is used to listen to real-time updates from a Firestore document or collection. It uses the onSnapshot function from the Firebase Firestore package to set up a listener that triggers a callback function whenever there are changes in the data.
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore";
import { notesCollection, db } from "./firebase";

export default function App() {
  // React.useState(() => ...) is  lazy state initialization. Used when you have an expensive computation for the initial state value
  const [notes, setNotes] = React.useState([]);
  const [currentNoteId, setCurrentNoteId] = React.useState("");

  // Used to find the current note object from an array of note objects called notes.The find() method is used to search for a note object in the notes array with an id property that matches the currentNoteId variable.If it finds a matching note, it returns that note object, otherwise, it returns the first note object in the notes array(notes[0]).If there are no notes in the array, it returns undefined.
  const currentNote =
    notes.find((note) => note.id === currentNoteId) || notes[0];

  // The sort() method uses a custom comparator function that compares the updatedAt property of each object in the array. It subtracts the updatedAt values to determine the order. If b.updatedAt - a.updatedAt is positive, it means b is more recent than a, and b should come first. If it's negative, a should come first. If it's zero, their positions remain unchanged
  //The resulting sorted array will have the items ordered from most-recently-updated to least-recently-updated.
  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);
  console.log("sortedNotes", sortedNotes);

  // everytime "notes" state is updated, update the notes key in local storage
  React.useEffect(() => {
    // The cleanup function is "unsubscribe", which is returned from the onSnapshot function
    // onSnapshot function takes in 2 arguments. Data to listen and a callback function
    // notesCollection is a reference to a Firestore collection. Used as an argument to the onSnapshot function, which sets up a real-time listener on the collection
    // "snapshot" is a representation of the state of the  notesCollection at a specific point in time. The snapshot contains the updated data, which you can use to sync your local state with the changes in the notesCollection
    const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
      // Sync up our local notes array with the snapshot data
      console.log("snapshot.docs > ", snapshot.docs);
      const notesArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotes(notesArr);
    });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id);
    }
  }, [notes]);

  // The createNewNote function is defined as an asynchronous function, allowing you to use the await keyword within it to wait for a promise to resolve.
  // A new note object is created with the newNote variable, containing a single property body with a default value of "# Type your markdown note's title here".
  // The addDoc function is called with the notesCollection and newNote as arguments (codedamn.com).addDoc is a Firebase function that adds a new document to the specified collection with the provided data.In this case, it adds a new note to the notesCollection with the content of newNote.The function returns a promise that resolves to a DocumentReference object, which represents the newly created document.
  // The await keyword is used to wait for the addDoc function to complete and resolve the promise.Once it's resolved, the DocumentReference object is stored in the newNoteRef variable.
  // The setCurrentNoteId function is called with the id property of the newNoteRef object.This function likely updates the state of the React component, setting the current note ID to the ID of the newly created note.This can be useful for tracking the currently selected or active note in the application.
  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newNoteRef = await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteRef.id);
  }

  //  The updateNote function receives a text parameter which represents the updated content of the note.
  // The docRef variable is created using the doc function from the Firebase Firestore API.It takes three arguments: the Firestore instance(db), the name of the collection where the notes are stored("notes"), and the ID of the note to be updated(currentNoteId).firebase.google.com
  // The setDoc function is called with the docRef, an object containing the updated text, and an options object with the merge property set to true.This function updates the document with the new content, and by setting the merge option to true, it ensures that only the specified fields are updated, while the other fields remain unchanged.
  //   { body: text }: This is an object that represents the updated data you want to store in the document.In this case, it contains a single field named body, with the value being the text parameter passed to the updateNote function. The body field will store the updated note content.
  // { merge: true }: This is an options object passed to the setDoc function. The merge property is set to true, which tells Firestore to merge the provided data with the existing document.If merge is set to true, only the specified fields in the data object will be updated, and the other fields in the document will remain unchanged.If the document does not exist, the setDoc function will create a new document with the provided data
  async function updateNote(text) {
    const docRef = doc(db, "notes", currentNoteId);
    await setDoc(
      docRef,
      { body: text, updatedAt: Date.now() },
      { merge: true }
    );
  }

  console.log(notes);

  // The deleteNote function is declared as an async function, allowing it to use the await keyword for handling asynchronous operations.It takes noteId as its argument, which is the ID of the note to be deleted from the Firestore database stackoverflow.com.
  // The doc function is called with the db(Firestore instance), the collection name "notes", and the noteId as arguments.This creates a document reference(docRef) pointing to the specific note document in the Firestore database blog.logrocket.com.
  // The deleteDoc function is called with the docRef as an argument.This function takes the document reference and attempts to delete the document from the Firestore database.Since deleteDoc returns a Promise, the await keyword is used to wait for the operation to complete
  async function deleteNote(noteId) {
    const docRef = doc(db, "notes", noteId);
    await deleteDoc(docRef);
  }

  // tempNoteText is the updated text that will be sent to notesCollection in Firestore
  const [tempNoteText, setTempNoteText] = React.useState("");

  // setTempNoteText updates tempNoteText with the currentNote.body content
  React.useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body);
    }
  }, [currentNote]);

  // The useEffect hook is triggered when the tempNoteText variable changes, as it is passed in the dependency array[tempNoteText].This means that the function inside the useEffect will run whenever tempNoteText is updated(reactgo.com).
  // When the useEffect function runs, it sets a timeout using setTimeout.The timeout will call the updateNote function and pass tempNoteText as an argument after 500 milliseconds.
  // The useEffect function also returns a cleanup function. This function will be called when the component is unmounted or when the tempNoteText value changes, which triggers the useEffect to run again.In this cleanup function, the previously set timeout is cleared using clearTimeout(timeoutId).This ensures that the timeout won't be executed if the component is unmounted or if the tempNoteText value changes before the timeout has been triggered.
  // "return () => clearTimeout(timeoutId)".This block of code ensures that the updateNote function is called after a 500ms delay, but only if the tempNoteText value remains unchanged during that time.If the value changes or the component is unmounted, the timeout will be cleared before it can be executed.
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tempNoteText !== currentNote.body) {
        updateNote(tempNoteText)
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [tempNoteText]);

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={sortedNotes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {
            <Editor
              tempNoteText={tempNoteText}
              setTempNoteText={setTempNoteText}
            />
          }
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
