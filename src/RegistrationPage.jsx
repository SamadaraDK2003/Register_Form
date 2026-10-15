import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RegistrationPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    nic: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    nic: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Today's date (YYYY-MM-DD)
  const getToday = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = getToday();

  // Validate individual fields
  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) return "This field is required.";
        if (!/^[A-Za-z]+$/.test(value.trim())) {
          return "Letters only.";
        }
        return "";

      case "dob": {
        if (!value) return "Date of birth is required.";

        if (value >= today) {
          return "Date of birth must be a past date.";
        }

        const dobDate = new Date(`${value}T00:00:00`);
        const oldest = new Date();
        oldest.setHours(0, 0, 0, 0);
        oldest.setFullYear(oldest.getFullYear() - 100);

        if (dobDate < oldest) {
          return "Age cannot be more than 100 years.";
        }

        return "";
      }

      case "gender":
        return !value ? "Gender is required." : "";

      case "email":
        if (!value.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return "Email is invalid.";
        }
        return "";

      case "nic":
        if (!value.trim()) return "NIC is required.";

        if (!/^([0-9]{9}[vVxX]|[0-9]{12})$/.test(value.trim())) {
          return "Enter a valid NIC.";
        }

        return "";

      case "password":
        if (!value) return "Password is required.";
        if (value.length < 6) {
          return "Password must be at least 6 characters.";
        }
        return "";

      case "confirmPassword":
        if (!value) return "Please confirm your password.";
        if (value !== form.password) {
          return "Passwords do not match.";
        }
        return "";

      default:
        return "";
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...form,
      [name]: value,
    };

    setForm(updatedForm);

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
      ...(name === "password" || name === "confirmPassword"
        ? {
            confirmPassword: updatedForm.confirmPassword
              ? updatedForm.password === updatedForm.confirmPassword
                ? ""
                : "Passwords do not match."
              : "",
          }
        : {}),
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  // Validate NIC against DOB and gender
  const validateNIC = (nic, dob, gender) => {
    const value = nic.trim().toUpperCase();

    const oldNIC = /^[0-9]{9}[VX]$/.test(value);
    const newNIC = /^[0-9]{12}$/.test(value);

    if (!oldNIC && !newNIC) {
      return "Enter a valid NIC number.";
    }

    const birthYear = oldNIC
      ? 1900 + Number(value.slice(0, 2))
      : Number(value.slice(0, 4));

    let dayCode = Number(oldNIC ? value.slice(2, 5) : value.slice(4, 7));

    // Decode gender (female = day code + 500)
    let nicGender;

    if (dayCode >= 1 && dayCode <= 366) {
      nicGender = "male";
    } else if (dayCode >= 501 && dayCode <= 866) {
      nicGender = "female";
      dayCode -= 500;
    } else {
      return "Invalid NIC birth date code.";
    }

    if (birthYear > new Date().getFullYear()) {
      return "Invalid birth date in NIC.";
    }

    const isLeapYear =
      birthYear % 4 === 0 && (birthYear % 100 !== 0 || birthYear % 400 === 0);

    // NIC always counts Feb 29 (day 60), so day 60 is invalid in non-leap years
    if (!isLeapYear && dayCode === 60) {
      return "Invalid birth date in NIC.";
    }

    // In non-leap years, every day after Feb 28 is shifted by 1 in the NIC
    const adjustedDay = !isLeapYear && dayCode > 60 ? dayCode - 1 : dayCode;

    // Calculate DOB from January 1
    const decodedDOB = new Date(birthYear, 0, adjustedDay);

    const year = decodedDOB.getFullYear();
    const month = String(decodedDOB.getMonth() + 1).padStart(2, "0");
    const day = String(decodedDOB.getDate()).padStart(2, "0");

    const nicDOB = `${year}-${month}-${day}`;

    if (nicDOB !== dob) {
      return "Date of birth does not match the NIC.";
    }

    if (nicGender !== gender.toLowerCase()) {
      return "Gender does not match the NIC.";
    }

    return "";
  };

  // Handle registration
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    Object.keys(form).forEach((key) => {
      newErrors[key] = validateField(key, form[key]);
    });

    // Validate NIC against DOB and gender
    if (!newErrors.nic && !newErrors.dob && !newErrors.gender) {
      newErrors.nic = validateNIC(form.nic, form.dob, form.gender);
    }

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(
      (message) => message !== ""
    );

    if (hasError) return;

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
      })
    );

    navigate("/home");
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClass = "block text-gray-700 text-sm font-bold mb-2";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-2xl bg-sky-100 p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Your Profile</h1>
          <p className="text-gray-500 text-sm mt-2">
            Fill out the form carefully for registration.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="firstName">
                First Name :
              </label>
              <input
                className={inputClass}
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Jony"
                value={form.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className={labelClass} htmlFor="lastName">
                Last Name :
              </label>
              <input
                className={inputClass}
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Farry"
                value={form.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="dob">
                Date of Birth(DOB) :
              </label>
              <input
                className={inputClass}
                id="dob"
                name="dob"
                type="date"
                max={today}
                value={form.dob}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="gender">
                Gender :
              </label>
              <select
                className={inputClass}
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="email">
              Email :
            </label>
            <input
              className={inputClass}
              id="email"
              name="email"
              type="text"
              placeholder="jon.farry@gmail.com"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="nic">
              NIC Number :
            </label>
            <input
              className={inputClass}
              id="nic"
              name="nic"
              type="text"
              placeholder="Sri Lankan ID Number"
              value={form.nic}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.nic && (
              <p className="text-red-500 text-sm mt-1">{errors.nic}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="password">
                Password :
              </label>
              <div className="relative">
                <input
                  className={
                    inputClass + " pr-10" + (errors.password ? " border-red-500" : "")
                  }
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="confirmPassword">
                Confirm Password :
              </label>
              <div className="relative">
                <input
                  className={
                    inputClass +
                    " pr-10" +
                    (errors.confirmPassword ? " border-red-500" : "")
                  }
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="********"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <button
            className="w-full bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white font-bold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition duration-200 shadow-md hover:shadow-lg"
            type="submit"
          >
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;