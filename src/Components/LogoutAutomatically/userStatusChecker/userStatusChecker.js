import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Real-time listener for user deletion with translation support
export const listenForUserDeletion = (userId, translations, Navigate) => {
  if (!userId) {
    console.error("No user ID provided for deletion listener.");
    return;
  }

  const userRef = doc(db, "users", userId);

  try {
    return onSnapshot(
      userRef,
      (docSnapshot) => {
        if (!docSnapshot.exists()) {
          Swal.fire({
            icon: "error",
            title: translations.title,
            text: translations.message,
            showConfirmButton: true,
            timerProgressBar: true,
            willClose: () => {
              localStorage.clear();

              // Navigate to the login page
              Navigate("/");
            },
          });
        }
      },
      (error) => {
        console.error("Error in onSnapshot listener:", error);
      }
    );
  } catch (error) {
    console.error("Error setting up onSnapshot listener:", error);
  }
};
