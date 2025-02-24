import { onSnapshot, doc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig"; // Your Firebase configuration

// Function to listen for deletion
const listenForUserDeletion = (userId) => {
  const userRef = doc(db, "users", userId); // 'users' collection with document ID as userId

  // Real-time listener
  return onSnapshot(userRef, (docSnapshot) => {
    if (!docSnapshot.exists()) {
      // User document no longer exists (deleted)
      handleUserDeletion();
    }
  });
};

// Function to handle logout if the user is deleted
const handleUserDeletion = () => {
  alert("Your account has been deleted. You will be logged out.");
  localStorage.removeItem("userId");
  auth.signOut(); // Log out the user from Firebase Authentication
  window.location.href = "/login"; // Redirect to the login page
};
