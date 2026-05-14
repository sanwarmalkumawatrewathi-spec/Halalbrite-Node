"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { User, Building2 } from 'lucide-react';

type TabType = "login" | "signup";
type RoleType = "attendee" | "organiser";

import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

export default function Signuppage() {
  const [tab, setTab] = useState<TabType>("login");
  const [role, setRole] = useState<RoleType>("attendee");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { login, register, socialLogin, socialSettings } = useAuth();
  const router = useRouter();

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");
      const result = await socialLogin('google', { idToken: tokenResponse.access_token });
      if (result.success) {
        router.push("/");
      } else {
        setError(result.message);
      }
      setLoading(false);
    },
    onError: () => setError("Google Login Failed"),
  });

  const responseFacebook = async (response: any) => {
    if (response.accessToken) {
      setLoading(true);
      setError("");
      const result = await socialLogin('meta', { accessToken: response.accessToken });
      if (result.success) {
        router.push("/");
      } else {
        setError(result.message);
      }
      setLoading(false);
    } else {
      setError("Facebook Login Failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (tab === "login") {
        const result = await login(email, password);
        if (result.success) {
          router.push("/");
        } else {
          setError(result.message);
        }
      } else {
        // Validation
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        const result = await register({
          email,
          password,
          username: username || email.split("@")[0],
          role: role
        });

        if (result.success) {
          setMessage("Account created successfully!");
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setError(result.message);
        }
      }
    } catch (err: any) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 min-h-[80vh] w-full pb-20">
      <div className="w-full max-w-md">

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4 cursor-pointer hover:opacity-80 transition-opacity">
            <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
              <text x="50" y="60" textAnchor="middle" fill="#DC2626" fontSize="60" fontFamily="cursive, 'Apple Chancery', 'Comic Sans MS', fantasy" fontWeight="700" strokeWidth="2.5" stroke="#DC2626" paintOrder="stroke">H</text>
              <circle cx="50" cy="38" r="3" fill="#EF4444"></circle>
              <text x="50" y="92" textAnchor="middle" fill="#DC2626" fontSize="24" fontFamily="'Trebuchet MS', 'Arial Rounded MT Bold', Verdana, sans-serif" fontWeight="700">Halalbrite</text>
            </svg>
          </div>
          <p className="text-gray-600">Connect with your community</p>
        </div>

        {/* Card */}
        <div className="bg-white flex flex-col gap-6 rounded-2xl shadow-xl border-0">
          <div className="flex flex-col gap-2 w-full">
            {/* Tabs List */}
            <div className="h-9 items-center justify-center rounded-xl grid w-full grid-cols-2 p-1 bg-red-50 rounded-t-2xl">
              <button
                type="button"
                onClick={() => { setTab("login"); setError(""); }}
                className={`inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all rounded-xl ${tab === "login" ? "bg-white text-red-700 shadow-sm" : "text-gray-500 hover:text-red-600"}`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setTab("signup"); setError(""); }}
                className={`inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all rounded-xl ${tab === "signup" ? "bg-white text-red-700 shadow-sm" : "text-gray-500 hover:text-red-600"}`}
              >
                Sign Up
              </button>
            </div>

            <div className="flex-1 outline-none p-6 pt-2">
              {/* Error/Success Messages */}
              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">{error}</div>}
              {message && <div className="mb-4 p-3 bg-green-100 text-green-700 text-sm rounded-lg">{message}</div>}

              {/* Form Content */}
              {tab === "login" && (
                <div className="space-y-4 mt-2">

                  {/* Social Buttons (Login) */}
                  <div className="space-y-3">
                    {socialSettings?.google?.isActive && (
                      <button
                        type="button"
                        onClick={() => googleLoginHandler()}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all h-9 px-4 py-2 w-full rounded-xl border-2 border-gray-200 hover:bg-gray-50 text-gray-700"
                      >
                        <div className="w-5 h-5 mr-2 bg-red-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                          </svg>
                        </div>
                        Continue with Google
                      </button>
                    )}

                    {socialSettings?.meta?.isActive && (
                      <FacebookLogin
                        appId={socialSettings.meta.clientId || ""}
                        callback={responseFacebook}
                        render={(renderProps: any) => (
                          <button
                            type="button"
                            onClick={renderProps.onClick}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all h-9 px-4 py-2 w-full rounded-xl border-2 border-gray-200 hover:bg-gray-50 text-gray-700"
                          >
                            <div className="w-5 h-5 mr-2 bg-blue-600 rounded flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                              </svg>
                            </div>
                            Continue with Meta
                          </button>
                        )}
                      />
                    )}
                  </div>

                  {/* Divider */}
                  {(socialSettings?.google?.isActive || socialSettings?.meta?.isActive) && (
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200"></span>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm leading-none font-medium text-gray-700" htmlFor="login-email">Email</label>
                      <input
                        type="email"
                        id="login-email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex h-9 w-full min-w-0 border border-gray-300 px-3 py-1 text-base bg-white transition-all outline-none md:text-sm focus-visible:ring-2 focus-visible:ring-red-400 rounded-xl mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm leading-none font-medium text-gray-700" htmlFor="login-password">Password</label>
                      <input
                        type="password"
                        id="login-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex h-9 w-full min-w-0 border border-gray-300 px-3 py-1 text-base bg-white transition-all outline-none md:text-sm focus-visible:ring-2 focus-visible:ring-red-400 rounded-xl mt-1"
                        required
                      />
                    </div>

                    <div className="text-right">
                      <button type="button" className="text-sm font-medium transition-all text-red-600 hover:underline p-0 h-auto">
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all text-white h-9 px-4 py-2 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {loading ? "Processing..." : "Log In"}
                    </button>
                  </form>
                </div>
              )}

              {/* Sign Up Content */}
              {tab === "signup" && (
                <div className="space-y-4 mt-2">
                  {/* Role Selection */}
                  <div className="flex flex-col gap-6 bg-red-50 rounded-xl">
                    <div className="p-4">
                      <div>
                        <label className="items-center gap-2 text-sm leading-none font-medium text-red-900 mb-3 block">Choose Account Type</label>
                        <div className="grid grid-cols-2 gap-3">

                          <div
                            onClick={() => setRole("attendee")}
                            className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${role === "attendee" ? "border-red-500 bg-red-50" : "border-gray-200 bg-white hover:border-red-300"}`}
                          >
                            <div className="flex flex-col items-center text-center gap-2">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${role === "attendee" ? "bg-red-100" : "bg-gray-100"}`}>
                                <User className={`w-6 h-6 ${role === "attendee" ? "text-red-600" : "text-gray-400"}`} />
                              </div>
                              <div>
                                <p className={`font-medium ${role === "attendee" ? "text-red-900" : "text-gray-700"}`}>Attendee</p>
                                <p className={`text-xs ${role === "attendee" ? "text-red-600" : "text-gray-500"}`}>Discover & attend events</p>
                              </div>
                            </div>
                          </div>

                          <div
                            onClick={() => setRole("organiser")}
                            className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${role === "organiser" ? "border-red-500 bg-red-50" : "border-gray-200 bg-white hover:border-red-300"}`}
                          >
                            <div className="flex flex-col items-center text-center gap-2">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${role === "organiser" ? "bg-red-100" : "bg-gray-100"}`}>
                                <Building2 className={`w-6 h-6 ${role === "organiser" ? "text-red-600" : "text-gray-400"}`} />
                              </div>
                              <div>
                                <p className={`font-medium ${role === "organiser" ? "text-red-900" : "text-gray-700"}`}>Organiser</p>
                                <p className={`text-xs ${role === "organiser" ? "text-red-600" : "text-gray-500"}`}>Create & manage events</p>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Buttons (Signup) */}
                  <div className="space-y-3">
                    {socialSettings?.google?.isActive && (
                      <button
                        type="button"
                        onClick={() => googleLoginHandler()}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all h-9 px-4 py-2 w-full rounded-xl border-2 border-gray-200 hover:bg-gray-50 text-gray-700"
                      >
                        <div className="w-5 h-5 mr-2 bg-red-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                          </svg>
                        </div>
                        Continue with Google
                      </button>
                    )}

                    {socialSettings?.meta?.isActive && (
                      <FacebookLogin
                        appId={socialSettings.meta.clientId || ""}
                        callback={responseFacebook}
                        render={(renderProps: any) => (
                          <button
                            type="button"
                            onClick={renderProps.onClick}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all h-9 px-4 py-2 w-full rounded-xl border-2 border-gray-200 hover:bg-gray-50 text-gray-700"
                          >
                            <div className="w-5 h-5 mr-2 bg-blue-600 rounded flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                              </svg>
                            </div>
                            Continue with Meta
                          </button>
                        )}
                      />
                    )}
                  </div>

                  {/* Divider */}
                  {(socialSettings?.google?.isActive || socialSettings?.meta?.isActive) && (
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200"></span>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm leading-none font-medium text-gray-700" htmlFor="signup-username">Username</label>
                      <input
                        type="text"
                        id="signup-username"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="flex h-9 w-full min-w-0 border border-gray-300 px-3 py-1 text-base bg-white transition-all outline-none md:text-sm focus-visible:ring-2 focus-visible:ring-red-400 rounded-xl mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm leading-none font-medium text-gray-700" htmlFor="signup-email">Email</label>
                      <input
                        type="email"
                        id="signup-email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex h-9 w-full min-w-0 border border-gray-300 px-3 py-1 text-base bg-white transition-all outline-none md:text-sm focus-visible:ring-2 focus-visible:ring-red-400 rounded-xl mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm leading-none font-medium text-gray-700" htmlFor="signup-password">Password</label>
                      <input
                        type="password"
                        id="signup-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex h-9 w-full min-w-0 border border-gray-300 px-3 py-1 text-base bg-white transition-all outline-none md:text-sm focus-visible:ring-2 focus-visible:ring-red-400 rounded-xl mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm leading-none font-medium text-gray-700" htmlFor="confirm-password">Confirm Password</label>
                      <input
                        type="password"
                        id="confirm-password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="flex h-9 w-full min-w-0 border border-gray-300 px-3 py-1 text-base bg-white transition-all outline-none md:text-sm focus-visible:ring-2 focus-visible:ring-red-400 rounded-xl mt-1"
                        required
                      />
                    </div>

                    <p className="text-gray-500 text-sm">By signing up, you agree to our Terms of Service and Privacy Policy</p>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all text-white h-9 px-4 py-2 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {loading ? "Processing..." : "Create Account"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all hover:bg-gray-200 h-9 px-4 py-2 text-red-600 hover:text-red-700">
              ← Back to Home
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}