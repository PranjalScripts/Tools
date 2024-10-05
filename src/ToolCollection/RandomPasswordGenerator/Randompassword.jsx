import { useCallback, useEffect, useRef, useState } from "react";
import { db } from "../DB/Firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import "./RandomPassword.css";
import useAuth from "../Pages/Auth/auth.js";
import { useNavigate } from "react-router-dom";
import PasswordDisplay from "./PasswordDisplay";

function Randompassword() {
  const [length, setLength] = useState(12);
  const [numbers, setNumbers] = useState(true);
  const [char, setChar] = useState(true);
  const [password, setPassword] = useState("");
  const [purpose, setPurpose] = useState("");
  const [username, setUsername] = useState("");
  const [passwordList, setPasswordList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordList, setShowPasswordList] = useState(false);

  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const passwordRef = useRef(null);

  const PasswordGenerator = useCallback(() => {
    let pass = "";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const num = "0123456789";
    const sym = "!@#$%^&*(){}`~_-=+/|,.<>";

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
        username: username || null,
      };

      setPasswordList((prevList) => [...prevList, newPasswordEntry]);
      setPurpose("");
      setUsername("");
      PasswordGenerator();

      try {
        await addDoc(collection(db, "passwords"), {
          ...newPasswordEntry,
          createdAt: serverTimestamp(),
        });
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
        const q = query(
          collection(db, "passwords"),
          where("uid", "==", currentUser.uid)
        );
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

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "passwords", id));
      setPasswordList((prevList) => prevList.filter((password) => password.id !== id));
      console.log(`Password with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting password: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-4">
      <div className="mt-5 w-full max-w-md bg-gray-800 p-5 rounded-md">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Logout
          </button>
        </div>
        <form className="w-full">
          <div className="mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username (optional)"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black/50"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Create password for..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black/50"
            />
          </div>
          <div className="flex w-full gap-2 justify-between items-center">
            <input
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white text-indigo-600 px-3 py-2 text-lg font-medium placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black/50 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
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
                className="w-full"
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

          <div className="mt-4 flex flex-col md:flex-row justify-between">
            <button
              type="button"
              onClick={addToPasswordList}
              className="flex rounded-lg bg-black px-4 py-2 font-semibold text-white hover:bg-black/80 hover:bg-gray-900"
            >
              Save Password
            </button>

            <button
              type="button"
              onClick={() => setShowPasswordList(!showPasswordList)}
              className="flex mt-2 md:mt-0 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
            >
              {showPasswordList ? "Hide Passwords" : "Show Passwords"}
            </button>
          </div>
        </form>
      </div>

      {/* Display passwords if the list is being shown */}
      {showPasswordList && (
        <div className="password-list">
          <PasswordDisplay passwordList={passwordList} onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
}

export default Randompassword;
