import { useState ,useContext } from "react";
import { db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { AuthContext } from "../components/Auth/AuthContext";

export default function UserRoleSelection() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("student"); // Default role
  const navigate = useNavigate();
  const { setUser , user } = useContext(AuthContext);


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add user data obj to context
    const userobj ={ ...user,role: role,username: username}
    console.log("User object:", userobj);
    setUser(userobj);

    const userId = user.uid 

    // update user data to Firestore
    await updateDoc(doc(db, "users", userId), {
      username: username,
      role: role,
    }, { merge: true });
    // Redirect to the corresponding dashboard based on role
    navigate(`/${role}-dashboard`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Set Username and Role</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-600">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="professor">Professor</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
