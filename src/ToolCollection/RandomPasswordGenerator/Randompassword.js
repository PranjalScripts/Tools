import { useCallback, useEffect, useRef, useState } from "react";
import { db } from  '../DB/Firebase' // Import your Firestore configuration
import { collection, addDoc } from "firebase/firestore"; // Firestore functions
import "./RandomPassword.css";

function Randompassword() {
  const [length, setLength] = useState(12);
  const [numbers, setNumbers] = useState(true);
  const [char, setChar] = useState(true);
  const [password, setPassword] = useState("");
  const [purpose, setPurpose] = useState("");
  const [passwordList, setPasswordList] = useState([]);

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
    if (purpose && password) {
      // Add to local password list
      setPasswordList((prevList) => [...prevList, { purpose, password }]);
      setPurpose("");

      // Store in Firestore
      try {
        const docRef = await addDoc(collection(db, "passwords"), {
          purpose: purpose,
          password: password,
        });
        console.log("Password added to Firestore with ID: ", docRef.id);
      } catch (error) {
        console.error("Error adding password: ", error);
      }
    } else {
      console.error("Purpose or password is empty.");
    }
  };


  return (
    <>
      <div className="w-[35rem] flex justify-center rounded-lg shadow-xl p-10 bg-zinc-700 h-auto absolute top-[38%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="mt-5 w-[34rem] ">
          <form className="w-full">
            <div className="mb-4">
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Select password for..."
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

            <div className="mt-8 w-[30rem] flex gap-1">
              <input
                type="range"
                min={12}
                max={28}
                defaultValue={length}
                onChange={(e) => setLength(e.target.value)}
              />
              <label htmlFor="length" className="text-green-300 text-lg">
                Length: {length}
              </label>
              <div className="flex items-center ml-3">
                <input
                  type="checkbox"
                  checked={numbers}
                  className="mr-2"
                  onChange={() => setNumbers((prev) => !prev)}
                />
                <label htmlFor="checkbox" className="text-green-300 text-lg">
                  Numbers
                </label>
              </div>
              <div className="flex items-center ml-3">
                <input
                  type="checkbox"
                  checked={char}
                  className="mr-2"
                  onChange={() => setChar((prev) => !prev)}
                />
                <label htmlFor="Characters" className="text-green-300 text-lg">
                  Special Characters
                </label>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={addToPasswordList}
                className="mt-2 rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Add to My Password List
              </button>
              <ul className="list-disc pl-5">
                {passwordList.map((item, index) => (
                  <li key={index} className="text-white">
                    {item.purpose}: {item.password}
                  </li>
                ))}
              </ul>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Randompassword;
