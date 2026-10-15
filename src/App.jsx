import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function RegistrationPage() {
  // local time
  const getToday = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = getToday();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // prevent form submission for now
  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordError) {
      alert("Please fix the password errors before submitting.");
      return;
    }
    alert("Registration submitted!");
  };
  const inputClass ="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClass = "block text-gray-700 text-sm font-bold mb-2";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-sky-100 p-8 rounded-2xl shadow-xl border border-gray-100">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Your Profile</h1>
          <p className="text-gray-500 text-sm mt-2">
            Fill out the form carefully for registration.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="firstName">First Name :</label>
              <input
                className={inputClass}
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Jony"
                required/>
            </div>
            <div>
              <label className={labelClass} htmlFor="lastName">Last Name :</label>
              <input
                className={inputClass}
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Farry"
                required/>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="dob">Date of Birth(DOB) :</label>
            <input
              className={inputClass}
              id="dob"
              name="dob"
              type="date"
              max={today}
              required/>
          </div>

          <div>
            <label className={labelClass} htmlFor="gender">Gender :</label>
            <select
              className={inputClass}
              id="gender"
              name="gender"
              defaultValue=""
              required>
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="email">Email :</label>
            <input
              className={inputClass}
              id="email"
              name="email"
              type="email"
              placeholder="jon.farry@gmail.com"
              required/>
          </div>

          <div>
            <label className={labelClass} htmlFor="nic">NIC Number :</label>
            <input
              className={inputClass}
              id="nic"
              name="nic"
              type="text"
              placeholder="Sri Lankan NIC"
              pattern="[0-9]{9}[vVxX]|[0-9]{12}"
              title="Enter a valid NIC (e.g., 123456789V or 200012345678)"
              required/>
          </div>

          <div className="relative">
            <label className={labelClass} htmlFor="password">Password :</label>
            <input
              className={inputClass}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              required/>
              <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
          </div>

          <div>
            <label className={labelClass} htmlFor="confirmPassword">Confirm Password :</label>
            <input
              className={inputClass}
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="********"
              required/>
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
          </div>



          <button
            className="w-full bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white font-bold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition duration-200 shadow-md hover:shadow-lg"
            type="submit">Register Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;