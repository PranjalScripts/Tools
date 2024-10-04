import { useState, useEffect } from "react";
import { auth } from "../../DB/Firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track user login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed, user: ", user); // Log user data
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Signup method
  const signup = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed up: ", result.user); // Log new user info
      setUser(result.user);
    } catch (error) {
      console.error("Error signing up: ", error);
      throw error;
    }
  };

  // Login method
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in: ", result.user); // Log user info
      setUser(result.user);
    } catch (error) {
      console.error("Error logging in: ", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Logout method
  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out"); // Log when user logs out
      setUser(null);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return { user, loading, login, logout, signup };
};

export default useAuth;
