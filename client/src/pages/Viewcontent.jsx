import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const VITE_API_URL = import.meta.env.VITE_API_URL;

const ViewContent = () => {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [askPassword, setAskPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const fetchData = async (passwordInput = "") => {
    try {
      const query = passwordInput ? `?password=${encodeURIComponent(passwordInput)}` : "";

      const response = await fetch(`${VITE_API_URL}/api/v1/link/viewLink/${id}${query}`,{ cache: 'no-store' });
      const result = await response.json();

      if (result.success) {
        if (result.data === "password_required") {
          setAskPassword(true);
        } else {
          setContent(result.data);
        }
      } else {
        setError(result.message || "Failed to fetch data.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchData(password);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto mt-10 bg-[#EFE4D2] shadow-md rounded">
      {askPassword ? (
        <form onSubmit={handlePasswordSubmit}>
          <label className="block mb-2 text-gray-700">Enter Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded mb-4"
            required
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Submit
          </button>
        </form>
      ) : content ? (
        typeof content === "string" && content.startsWith("http") ? (
          <div>
            <p className="mb-4 font-semibold">Cloudinary File:</p>
            {content.endsWith(".pdf") ? (
              <iframe src={content} title="PDF" className="w-full h-[500px]" />
            ) : content.endsWith(".jpg") || content.endsWith(".png") ? (
              <img src={content} alt="Content" className="max-w-full h-auto" />
            ) : content.endsWith(".zip") ? (
              <a href={content} download className="text-blue-500 underline">
                Download ZIP
              </a>
            ) : (
              <a href={content} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Open Link
              </a>
            )}
          </div>
        ) : (
          <p className="whitespace-pre-line">{content}</p>
        )
      ) : null}
    </div>
  );
};

export default ViewContent;
