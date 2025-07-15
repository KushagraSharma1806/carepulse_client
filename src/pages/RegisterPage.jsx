import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import API from "../api";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});
    try {
      const response = await API.post("/register", formData);
      if (response.status === 200 || response.data.id) {
        setRegistrationSuccess(true);
        localStorage.setItem("registeredEmail", formData.email);
        setTimeout(() => {
          navigate("/login", {
            state: {
              registeredEmail: formData.email,
              registrationSuccess: true,
            },
          });
        }, 2000);
      } else {
        setErrors({ submit: "Unexpected response from server." });
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      setErrors({
        submit:
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-teal-600 mb-6">Create Your Account</h2>

        {registrationSuccess ? (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
            Registration successful! Redirecting to login...
          </div>
        ) : errors.submit ? (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {errors.submit}
          </div>
        ) : null}

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Kushagra Sharma"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none transition shadow-sm ${
                errors.name ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-teal-300'
              }`}
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. kushagra@email.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none transition shadow-sm ${
                errors.email ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-teal-300'
              }`}
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none transition shadow-sm ${
                errors.password ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-teal-300'
              }`}
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading || registrationSuccess}
            className={`w-full py-3 text-white font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 transition shadow ${
              isLoading || registrationSuccess ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex justify-center items-center">
                <svg className="animate-spin mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
                Registering...
              </span>
            ) : registrationSuccess ? 'Success!' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Already registered?{' '}
          <Link to="/login" className="text-teal-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
