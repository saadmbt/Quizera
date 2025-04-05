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
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-100">
      <div className="w-full max-w-lg">
        <div className="w-full p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="text-center gap-2 mb-8">
            <p className="text-gray-800 text-2xl font-bold mb-2">Personalize</p>
            <p className="text-blue-600 text-md">Let's finish setting up your account</p>
          </div>
          
          <form onSubmit={handleSubmit}>
          <div className="mb-6">
              <label htmlFor="username" className="block text-gray-800 font-lg mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-800 font-lg mb-4">
                Which best describes you?
              </label>
              
              <div className="space-y-3">
                <div 
                  className={`p-4 border rounded-md flex justify-between items-center cursor-pointer ${role === "student" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                  onClick={() => setRole("student")}
                >
                  <span className="text-gray-800">Student</span>
                  <div className={`w-6 h-6 rounded-full border-2 ${role === "student" ? "border-blue-500" : "border-gray-300"}`}>
                    {role === "student" && <div className="w-4 h-4 bg-blue-500 rounded-full m-[3px]"></div>}
                  </div>
                </div>
                
                <div 
                  className={`p-4 border rounded-md flex justify-between items-center cursor-pointer ${role === "professor" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                  onClick={() => setRole("professor")}
                >
                  <span className="text-gray-800">Teacher</span>
                  <div className={`w-6 h-6 rounded-full border-2 ${role === "professor" ? "border-blue-500" : "border-gray-300"}`}>
                    {role === "professor" && <div className="w-4 h-4 bg-blue-500 rounded-full m-[3px]"></div>}
                  </div>
                </div>
                
              </div>
            </div>
            
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="px-10 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-lg transition duration-200"
              >
                Finish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
