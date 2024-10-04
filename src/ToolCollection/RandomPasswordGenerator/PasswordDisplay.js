import React, { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore"; // Import delete function
import { db } from "../DB/Firebase"; // Import Firestore configuration

function PasswordDisplay({ passwordList, onPasswordClick, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [copyMessage, setCopyMessage] = useState(""); // State for copy confirmation
  const itemsPerPage = 5;

  // Sort passwordList by the createdAt field
  const sortedPasswords = passwordList.sort((a, b) =>
    a.createdAt && b.createdAt ? b.createdAt - a.createdAt : 0
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(passwordList.length / itemsPerPage);

  // Get passwords for the current page
  const currentPasswords = sortedPasswords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function to handle page change
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Function to delete a password from Firestore
  const deletePassword = async (id) => {
    try {
      // Delete password from Firestore
      await deleteDoc(doc(db, "passwords", id)); // Make sure the `id` is correct
      // Notify parent component to remove password from the list
      onDelete(id);
    } catch (error) {
      console.error("Error deleting password: ", error);
    }
  };

  // Function to copy password to clipboard
  const copyToClipboard = (password) => {
    navigator.clipboard
      .writeText(password) // Copy password to clipboard
      .then(() => {
        setCopyMessage("Password copied!"); // Show success message
        setTimeout(() => setCopyMessage(""), 2000); // Clear the message after 2 seconds
      })
      .catch((error) => {
        console.error("Failed to copy password: ", error);
      });
  };

  return (
    <div className="mt-6 overflow-x-auto">
      <h3 className="text-gray text-lg font-semibold mb-4">
        Stored Passwords:
      </h3>

      {copyMessage && <p className="text-green-500">{copyMessage}</p>}

      {currentPasswords.length > 0 ? (
        <>
          <table className="min-w-full bg-gray-800 border border-gray-600">
            <thead>
              <tr>
                <th className="border border-gray-600 px-4 py-2 text-left text-white">
                  #
                </th>
                <th className="border border-gray-600 px-4 py-2 text-left text-white">
                  Username
                </th>
                <th className="border border-gray-600 px-4 py-2 text-left text-white">
                  Platform Name
                </th>
                <th className="border border-gray-600 px-4 py-2 text-left text-white">
                  Password
                </th>
                <th className="border border-gray-600 px-4 py-2 text-left text-white">
                  Copy
                </th>
                <th className="border border-gray-600 px-4 py-2 text-left text-white">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="text-white">
              {currentPasswords.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-700">
                  <td className="border border-gray-600 px-4 py-2">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {item.username || "N/A"}{" "}
                    {/* Display username or "N/A" if not provided */}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {item.purpose}
                  </td>
                  <td
                    className="border border-gray-600 px-4 py-2 cursor-pointer"
                     
                  >
                    {item.password}
                  </td>
                  <td className="border border-gray-600 px-4 py-2 text-center">
                    <button
                      onClick={() => copyToClipboard(item.password)} // Copy password on click
                      className="text-blue-500 hover:text-blue-700"
                    >
                      📋 Copy
                    </button>
                  </td>
                  <td className="border border-gray-600 px-4 py-2 text-center">
                    <button
                      onClick={() => deletePassword(item.id)} // Ensure `item.id` is valid
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-white bg-gray-600 rounded-md ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>

            <span className="text-gray">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-white bg-gray-600 rounded-md ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray">No passwords saved yet.</p>
      )}
    </div>
  );
}

export default PasswordDisplay;
