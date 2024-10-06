import React, { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore"; // Import delete function
import { db } from "../DB/Firebase"; // Import Firestore configuration

function PasswordDisplay({ passwordList, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [copyMessage, setCopyMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState(""); // State for delete indication
  const itemsPerPage = 5;

  // Sort passwords by createdAt in descending order
  const sortedPasswords = passwordList.sort((a, b) =>
    a.createdAt && b.createdAt ? b.createdAt - a.createdAt : 0
  );

  // Calculate total pages based on items per page
  const totalPages = Math.ceil(passwordList.length / itemsPerPage);

  // Get passwords for the current page
  const currentPasswords = sortedPasswords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle password deletion
  const deletePassword = async (id) => {
    try {
      await deleteDoc(doc(db, "passwords", id)); // Delete from Firestore
      onDelete(id); // Call onDelete to update the UI
      setDeleteMessage("Password deleted successfully!"); // Set delete indication message
      setTimeout(() => setDeleteMessage(""), 2000); // Clear message after 2 seconds
    } catch (error) {
      console.error("Error deleting password: ", error);
    }
  };

  // Handle password copy to clipboard
  const copyToClipboard = (password) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(password)
        .then(() => {
          setCopyMessage("Password copied!"); // Set success message
          setTimeout(() => setCopyMessage(""), 2000); // Clear message after 2 seconds
        })
        .catch((error) => {
          console.error("Failed to copy password: ", error);
          setCopyMessage("Failed to copy password."); // Set failure message
          setTimeout(() => setCopyMessage(""), 2000); // Clear message after 2 seconds
        });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = password;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopyMessage("Password copied!"); // Set success message
        setTimeout(() => setCopyMessage(""), 2000); // Clear message after 2 seconds
      } catch (error) {
        console.error("Failed to copy password using fallback: ", error);
        setCopyMessage("Failed to copy password."); // Set failure message
        setTimeout(() => setCopyMessage(""), 2000); // Clear message after 2 seconds
      }
      document.body.removeChild(textArea); // Clean up
    }
  };

  return (
    <div className="mt-6 mx-4">
      <h3 className="text-gray text-lg font-semibold mb-4">
        Stored Passwords:
      </h3>
      {copyMessage && <p className="text-green-500">{copyMessage}</p>}
      {deleteMessage && <p className="text-red-500">{deleteMessage}</p>}{" "}
      {/* Delete indication message */}
      {currentPasswords.length > 0 ? (
        <>
          <div className="overflow-x-auto overflow-y-auto max-h-96">
            <table className="min-w-full bg-gray-800 border border-gray-600">
              <thead>
                <tr>
                  <th className="border border-gray-600 px-2 py-2 text-left text-white">
                    #
                  </th>
                  <th className="border border-gray-600 px-2 py-2 text-left text-white">
                    Platform Name
                  </th>
                  <th className="border border-gray-600 px-2 py-2 text-left text-white">
                    Username
                  </th>
                  <th className="border border-gray-600 px-2 py-2 text-left text-white">
                    Password
                  </th>
                  <th className="border border-gray-600 px-2 py-2 text-left text-white">
                    Copy
                  </th>
                  <th className="border border-gray-600 px-2 py-2 text-left text-white">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="text-white">
                {currentPasswords.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-700">
                    <td className="border border-gray-600 px-2 py-2 text-center">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td className="border border-gray-600 px-2 py-2">
                      {item.purpose}
                    </td>
                    <td className="border border-gray-600 px-2 py-2">
                      {item.username || "N/A"}
                    </td>
                    <td
                      className="border border-gray-600 px-2 py-2 cursor-pointer"
                      onClick={() => copyToClipboard(item.password)}
                    >
                      {item.password}
                    </td>
                    <td className="border border-gray-600 px-2 py-2 text-center">
                      <button
                        onClick={() => copyToClipboard(item.password)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        📋 Copy
                      </button>
                    </td>
                    <td className="border border-gray-600 px-2 py-2 text-center">
                      <button
                        onClick={() => deletePassword(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row justify-between mt-4">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-white bg-gray-600 rounded-md ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>

            <span className="text-gray mt-2 md:mt-0">
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
