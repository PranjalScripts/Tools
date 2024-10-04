import { useCallback, useEffect, useRef, useState } from "react";
import { db } from "../DB/Firebase"; // Import your Firestore configuration
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore"; // Firestore functions
import "./RandomPassword.css";
import useAuth from "../Pages/Auth/auth.js"; // Import useAuth hook
import { useNavigate } from "react-router-dom"; // useNavigate replaces useHistory in react-router-dom v6
import PasswordDisplay from "./PasswordDisplay"; // Import PasswordDisplay component
import { query, where } from "firebase/firestore";

function Randompassword() {
  const [length, setLength] = useState(12);
  const [numbers, setNumbers] = useState(true);
  const [char, setChar] = useState(true);
  const [password, setPassword] = useState("");
  const [purpose, setPurpose] = useState("");
  const [username, setUsername] = useState(""); // New optional username state
  const [passwordList, setPasswordList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordList, setShowPasswordList] = useState(false); // New state to toggle password display

  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const PasswordGenerator = useCallback(() => {
    let pass = "";
    let lower = "abcdefghijklmnopqrstuvwxyz";
    let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let num = "0123456789";
    let sym = "!@#$%^&*(){}`~_-=+/|,.<>";

    if (numbers) pass += num.charAt(Math.floor(Math.random() * num.length));
    if (lower) pass += lower.charAt(Math.floor(Math.random() * lower.length));
    if (upper) pass += upper.charAt(Math.floor(Math.random() * upper.length));
    if (char) pass += sym.charAt(Math.floor(Math.random() * sym.length));

    let allCharacters = lower + upper;
    if (numbers) allCharacters += num;
    if (char) allCharacters += sym;

    for (let i = pass.length; i < length; i++) {
      let randomIndex = Math.floor(Math.random() * allCharacters.length);
      pass += allCharacters.charAt(randomIndex);
    }

    pass = pass
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setPassword(pass);
  }, [length, numbers, char]);

  useEffect(() => {
    PasswordGenerator();
  }, [length, numbers, char, PasswordGenerator]);

  const passwordRef = useRef(null);
  const copyPassMethod = useCallback(() => {
    passwordRef.current?.select();
    window.navigator.clipboard.writeText(password);
  }, [password]);

  const addToPasswordList = async () => {
    if (purpose && password && currentUser) {
      const newPasswordEntry = {
        purpose,
        password,
        uid: currentUser.uid,
        username: username || null, // Add username if provided, else null
      };

      setPasswordList((prevList) => [...prevList, newPasswordEntry]);
      setPurpose("");
      setUsername(""); // Reset username after adding
      PasswordGenerator();
      try {
        const docRef = await addDoc(collection(db, "passwords"), {
          ...newPasswordEntry,
          createdAt: serverTimestamp(),
        });
        console.log("Password added to Firestore with ID: ", docRef.id);
      } catch (error) {
        console.error("Error adding password: ", error);
      }
    } else {
      console.error("Purpose, password, or user is missing.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out: ", error);
    }
  };

  const fetchPasswords = async () => {
    if (currentUser) {
      try {
        const q = query(collection(db, "passwords"), where("uid", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        const fetchedPasswords = [];
        querySnapshot.forEach((doc) => {
          fetchedPasswords.push({ id: doc.id, ...doc.data() });
        });
        setPasswordList(fetchedPasswords);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching passwords: ", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, [currentUser]);

  const refreshPassword = () => {
    setPurpose("");
    PasswordGenerator();
  };

  const handleDelete = (id) => {
    setPasswordList((prevList) => prevList.filter((password) => password.id !== id));
  };

  return (
    <div className="flex flex-col md:flex-row items-start w-full h-auto p-4 md:p-10">
      <div className="mt-5 w-full max-w-md bg-gray-800 p-5 rounded-md">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Logout
          </button>
        </div>
        <form className="w-full ">
          {/* Username input (optional) */}
          <div className="mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username (optional)"
              className="w-full rounded-md border border-grey/50 bg-white px-3 py-2 text-[1rem] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black/50"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Create password for..."
              className="w-full rounded-md border border-grey/50 bg-white px-3 py-2 text-[1rem] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black/50"
            />
          </div>
          <div className="flex w-full gap-2 justify-between items-center">
            <input
              className="flex h-10 w-full rounded-md border border-grey/50 bg-white text-indigo-600 px-3 py-2 text-[1.35rem] font-medium font-sans placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black/50 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              value={password}
              placeholder="Password"
              readOnly
              ref={passwordRef}
            />
            <button
              type="button"
              onClick={copyPassMethod}
              className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Copy
            </button>
          </div>

          <div className="mt-8 flex flex-col md:flex-row justify-between items-center w-full">
            <div className="flex items-center w-full md:w-auto">
              <input
                type="range"
                min={12}
                max={50}
                defaultValue={length}
                onChange={(e) => setLength(e.target.value)}
              />
              <label htmlFor="length" className="text-green-600 text-lg ml-2">
                Length: {length}
              </label>
            </div>
            <div className="flex items-center mt-2 md:mt-0">
              <input
                type="checkbox"
                checked={numbers}
                className="mr-2"
                onChange={() => setNumbers((prev) => !prev)}
              />
              <label htmlFor="checkbox" className="text-green-600 text-lg">
                Numbers
              </label>
            </div>
            <div className="flex items-center mt-2 md:mt-0">
              <input
                type="checkbox"
                checked={char}
                className="mr-2"
                onChange={() => setChar((prev) => !prev)}
              />
              <label htmlFor="Characters" className="text-green-600 text-lg">
                Special Characters
              </label>
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={addToPasswordList}
              className="flex rounded-lg bg-black px-4 py-2 font-semibold text-white hover:bg-black/80 hover:bg-gray-900"
            >
              Save Password
            </button>

            <button
              type="button"
              onClick={() => setShowPasswordList(!showPasswordList)} // Toggle password display
              className="flex rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
            >
              {showPasswordList ? "Hide Passwords" : "Show Passwords"}
            </button>
          </div>
        </form>
      </div>

      {/* Conditional rendering of password list */}
      {showPasswordList && (
        <PasswordDisplay
          passwordList={passwordList}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default Randompassword;
