import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import "./App.css";
import Login from "./components/Auth/Login";
import LostFoundPage from "./components/LostFound";
console.log("APP.JS before app");
export default function App() {
  console.log("APP function firstline 1");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
console.log("APP function firstline 2");
  useEffect(() => {
    console.log("inside useeffect firstline ");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("inside onauthchanged ")
      setUser(currentUser);
      console.log("after user is set user",user);
      setLoading(false);
      console.log("after loading is set false loading",loading);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    console.log("before login user is ",user);
    return <Login onAuthSuccess={() => setUser(auth.currentUser)} />;
  }

  const handleLogout = async () => {
    console.log("inside handle logout 1");
    try {
      await signOut(auth);
      setUser(null);
      console.log("after logout user is ",user);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const uiElements=(
    <div className="App">
      <div className="app-header">
        <span className="welcome-user">
          Welcome, <strong>{user.email}</strong>
        </span>
        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </button>
      </div>
      <LostFoundPage />
    </div>
  );
console.log("uiElements",uiElements)  ;
  return uiElements;
}
