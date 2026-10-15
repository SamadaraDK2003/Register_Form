import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, User, LogOut, CheckCircle2 } from "lucide-react";

// Read and validate the saved user from localStorage
const getStoredUser = () => {
  try {
    const saved = localStorage.getItem("user");
    if (!saved) return null;

    const data = JSON.parse(saved);
    return data?.name && data?.email ? data : null;
  } catch {
    return null;
  }
};

// Build initials from the full name (e.g. "Samadara Dilrukshi" -> "SD")
const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

function HomePage() {
  const navigate = useNavigate();
  const [user] = useState(getStoredUser);

  // Redirect to registration if there is no valid saved user
  useEffect(() => {
    if (!user) {
      localStorage.removeItem("user");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  if (!user) return null;

  const details = [
    { label: "Full Name", value: user.name, Icon: User },
    { label: "Email Address", value: user.email, Icon: Mail },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-lg bg-sky-100 p-8 rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500 text-2xl font-bold text-white shadow-md">
            {getInitials(user.name)}
          </div>

          <h1 className="text-3xl font-bold text-gray-800">Welcome Home!</h1>

          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle2 size={16} />
            You have successfully registered.
          </p>
        </div>

        {/* User details */}
        <div className="rounded-xl bg-white p-2 shadow-sm">
          {details.map(({ label, value, Icon }, index) => (
            <div
              key={label}
              className={`flex items-center gap-4 p-4 ${
                index !== details.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-cyan-600">
                <Icon size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {label}
                </p>
                <p className="truncate text-gray-800 font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 py-2.5 px-4 font-bold text-white shadow-md transition duration-200 hover:bg-red-600 hover:shadow-lg active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default HomePage;