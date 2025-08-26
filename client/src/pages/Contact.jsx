import React,{useState} from 'react'
import Navbar from '../components/NavBar'
import Footer from '../components/Footer'
import { Helmet } from "react-helmet";
import axios from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL;

const Contact = () => {
  const [formData, setFormData] = useState({
    name:"",
    email: "",
    text: "",
    message: ""
  })
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await axios.post(`${VITE_API_URL}/api/v1/contact/send`,formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setStatus({ type: 'success', message: result.message });
      setFormData({ name: "", email: "", text: "", message: "" });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  }
     
  return (
    <>
     <Helmet>
        <title>Contact Us</title>
        <meta name="title" content="Contact Us" />
        <meta name="description" content="Have questions, suggestions, or feedback? We’d love to hear from you. Just fill out the form below." />
        <link rel="canonical" href="/contact" />
        <meta name="robots" content="index, follow" />
      </Helmet>
    <Navbar/>
    <section className="bg-[#EFE4D2] py-16 px-4" id="contact">
      <div className="max-w-3xl   mx-auto text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-sans font-bold text-[#131D4F]">Get in Touch</h2>
        <p className="text-[#954C2E] mt-4">
          Have questions, suggestions, or feedback? We’d love to hear from you. Just fill out the form below.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-[#eae5dd]  shadow-xl outline-2 outline-[#c2aba3] rounded-2xl p-8">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="col-span-1">
            <label className="block mb-2 text-gray-700 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-4 py-3 border border-[#c2aba3] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div className="col-span-1">
            <label className="block mb-2 text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-[#c2aba3] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Subject */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-gray-700 font-semibold">Subject</label>
            <input
              type="text"
              name='text'
              value={formData.text}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full px-4 py-3 border border-[#c2aba3] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Message */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-gray-700 font-semibold">Message</label>
            <textarea
              rows="5"
              name='message'
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Write your message..."
              className="w-full px-4 py-3 border border-[#c2aba3] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            ></textarea>
          </div>
             {/* Status Message */}
             {status && (
              <div className="md:col-span-2 text-center">
                <p className={`text-sm ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {status.message}
                </p>
              </div>
            )}

          {/* Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </section>
    <Footer/>
    </>
  )
}

export default Contact