import React, { useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const Linkform = () => {
  const [activeTab, setActiveTab] = useState("text");

  // from state
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [maxClicks, setMaxClicks] = useState("Unlimited");
  const [expiresAt, setExpiresAt] = useState("Never");
  const [password, setPassword] = useState("");
  const [restrictedIp, setRestrictedIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
 

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://www.safeexpire.com/view/${result.link}`);
    alert("Copied to clipboard!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      let response;

      const payload = {
        maxClicks,
        expiresAt,
        password,
        restrictedIp,
      };

      // 🟡 Validate input based on tab
      if (activeTab === "file") {
        if (!file) {
          setLoading(false);
          return alert("Please upload a file.");
        }
        const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSizeInBytes) {
          setLoading(false);
          return alert("File size must be less than or equal to 2MB.");
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("maxClicks", maxClicks);
        formData.append("expiresAt", expiresAt);
        formData.append("password", password);
        formData.append("restrictedIp", restrictedIp);
        //${API_BASE_URL}/api/${API_VERSION}
        // ✅ FIXED: Endpoint should be generateLinkFile for file
        const res = await axios.post(
          `${VITE_API_URL}/api/v1/link/generateLinkText`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        response = res.data;
      } else if (activeTab === "text") {
        if (!text.trim()) {
          setLoading(false);
          return alert("Please enter some text.");
        }

        const res = await axios.post(
          "https://safeexpire.onrender.com/api/v1/link/generateLinkText",
          {
            text,
            ...payload,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        response = res.data;
      }

      // ✅ Show success message

      console.log("Link created successfully:", response);
      setResult(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      setResult({ success: false, message: "Server error. Try again later." });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#EFE4D2] flex flex-col items-center px-4 py-10">
      {/* Header */}
      {/* <header className="w-full max-w-7xl flex justify-between items-center mb-8">
        
        <button className="text-sm text-blue-700 hover:underline">My Shares</button>
      </header> */}

      {/* Main Card */}
      <div className="bg-[#eae5dd] shadow-xl rounded-xl outline-2 outline-[#c2aba3] w-full max-w-3xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Share Files & Text Securely
        </h2>
        <p className="text-center text-sm text-[#954C2E] mb-6">
          Create one-time or time-limited links for secure file sharing. Perfect
          for sensitive documents, passwords, and confidential information.
        </p>

        {/* Tabs */}
        <div className="flex items-center justify-center border-b mb-4">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "text"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("text")}
          >
            Share Text
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "file"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("file")}
          >
            Upload File
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Content Area */}
          <div className="mb-6">
            {activeTab === "text" ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full border border-[#c2aba3] rounded-lg p-3 min-h-[120px] resize-none"
                placeholder="Enter the text you want to share securely..."
              ></textarea>
            ) : (
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full border border-[#c2aba3] rounded-lg p-3"
              />
            )}
          </div>

          {/* Security Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Views
              </label>
              <select
                className="w-full border border-[#c2aba3] rounded-lg p-2"
                value={maxClicks}
                onChange={(e) => setMaxClicks(e.target.value)}
              >
                <option>Unlimited</option>
                <option>1</option>
                <option>5</option>
                <option>10</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Expires In
              </label>
              <select
                className="w-full border border-[#c2aba3] rounded-lg p-2"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              >
                <option>Never</option>
                <option>5 Minutes</option>
                <option>10 Minutes</option>
                <option>30 Minutes</option>
                <option>1 Hour</option>
                <option>1 Day</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Password (Optional)
              </label>
              <input
                type="password"
                placeholder="Add password protection"
                className="w-full border border-[#c2aba3] rounded-lg p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Allowed IP Addresses (Optional)
              </label>
              <input
                type="text"
                placeholder="192.168.1.1, 10.0.0.1 (comma-separated)"
                className="w-full border border-[#c2aba3] rounded-lg  p-2"
                value={restrictedIp}
                onChange={(e) => setRestrictedIp(e.target.value)}
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Creating Link..." : "Create Share Link"}
          </button>
        </form>

        {/* Result Message */}

        {/* Result */}
        {result && (
          <div className="mt-6 p-4 border rounded bg-white text-gray-800 max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto shadow-md">
            <p className="mb-4 text-sm sm:text-base break-words">
              ✅ Link Created:{" "}
              <a
                href={`https://www.safeexpire.com/view/${result.link}`}
                className="text-blue-700 underline break-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {`https://www.safeexpire.com/view/${result.link}`}
              </a>
            </p>
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Linkform;
