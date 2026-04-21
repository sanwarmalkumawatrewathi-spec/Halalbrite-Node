


"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

type TabType = "login" | "signup";
type RoleType = "attendee" | "organiser";

import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import AppleLogin from 'react-apple-login';

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

  const responseApple = async (response: any) => {
    if (response.authorization?.id_token) {
      setLoading(true);
      setError("");
      const result = await socialLogin('apple', { identityToken: response.authorization.id_token });
      if (result.success) {
        router.push("/");
      } else {
        setError(result.message);
      }
      setLoading(false);
    } else {
      setError("Apple Login Failed");
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
    <div className=" flex flex-col items-center justify-center bg-gray-100 px-4 pb-4">
      
      {/* Logo */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-red-600">H</div>
        <h1 className="text-2xl font-semibold text-red-600">HalalBrite</h1>
        <p className="text-gray-500 mt-2">Connect with your community</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-6">

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-full mb-6 p-1">
          <button
            onClick={() => { setTab("login"); setError(""); }}
            className={`w-1/2 py-2 rounded-full text-sm ${
              tab === "login" ? "bg-white text-red-600 shadow" : "text-gray-500"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setTab("signup"); setError(""); }}
            className={`w-1/2 py-2 rounded-full text-sm ${
              tab === "signup" ? "bg-white text-red-600 shadow" : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-100 text-green-700 text-sm rounded-lg">{message}</div>}

        {/* ================= SIGN UP ================= */}
        {tab === "signup" && (
          <>
            {/* Account Type */}
            <div className="bg-red-50 p-4 rounded-xl mb-4">
              <p className="text-sm font-medium mb-3">Choose Account Type</p>

              <div className="grid grid-cols-2 gap-3">
                {/* Attendee */}
                <button
                  type="button"
                  onClick={() => setRole("attendee")}
                  className={`p-4 rounded-xl border text-left ${
                    role === "attendee"
                      ? "border-red-500 bg-white shadow-sm"
                      : "border-gray-200"
                  }`}
                >
                  <div className="text-red-500 mb-2 text-xl">👤</div>
                  <p className="font-medium text-sm">Attendee</p>
                  <p className="text-xs text-gray-500">
                    Discover & attend events
                  </p>
                </button>

                {/* Organiser */}
                <button
                  type="button"
                  onClick={() => setRole("organiser")}
                  className={`p-4 rounded-xl border text-left ${
                    role === "organiser"
                      ? "border-red-500 bg-white shadow-sm"
                      : "border-gray-200"
                  }`}
                >
                  <div className="text-gray-500 mb-2 text-xl">🏢</div>
                  <p className="font-medium text-sm">Organiser</p>
                  <p className="text-xs text-gray-500">
                    Create & manage events
                  </p>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Social Buttons */}
        <div className="space-y-3">
          {socialSettings?.apple?.isActive && (
            <AppleLogin
              clientId={socialSettings.apple.clientId || ""}
              redirectURI={typeof window !== 'undefined' ? window.location.origin : ""}
              callback={responseApple}
              render={(props: any) => (
                <button 
                  type="button"
                  onClick={props.onClick}
                  className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-2 hover:bg-gray-50 transition-colors"
                >
                  <span className="w-4 h-4 bg-black rounded-sm"></span>
                  Continue with Apple
                </button>
              )}
            />
          )}

          {socialSettings?.google?.isActive && (
            <button 
              type="button"
              onClick={() => googleLoginHandler()}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-2 hover:bg-gray-50 transition-colors"
            >
              <span className="w-4 h-4 bg-red-500 rounded-full"></span>
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
                  className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-2 hover:bg-gray-50 transition-colors"
                >
                  <span className="w-4 h-4 bg-blue-600 rounded-sm"></span>
                  Continue with Meta
                </button>
              )}
            />
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-sm text-gray-400">
            {tab === "login"
              ? "Or continue with email"
              : "Or sign up with email"}
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "signup" && (
            <div>
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                required={tab === "signup"}
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
              required
            />
          </div>

          {/* Confirm Password only in signup */}
          {tab === "signup" && (
            <div>
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                required
              />
            </div>
          )}

          {/* Forgot (only login) */}
          {tab === "login" && (
            <div className="text-right">
              <button type="button" className="text-red-500 text-sm hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          {/* Terms (only signup) */}
          {tab === "signup" && (
            <p className="text-xs text-gray-500">
              By signing up, you agree to our Terms of Service and Privacy
              Policy
            </p>
          )}

          {/* Submit */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-red-600 text-white py-3 rounded-full font-medium hover:bg-red-700 transition-colors shadow-lg ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Processing..." : tab === "login" ? "Log In" : "Create Account"}
          </button>
        </form>
      </div>

      {/* Back */}
      <Link href={"/"}>
        <button className="mt-6 mb-2 text-red-500 text-sm hover:underline flex items-center gap-1">
          <span>←</span> Back to Home
        </button>
      </Link>
      
    </div>
  );
}