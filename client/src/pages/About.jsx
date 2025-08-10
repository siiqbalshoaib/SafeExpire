import React from "react";
import Navbar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us</title>
        <meta name="title" content="About Us" />
        <meta
          name="description"
          content="We’re not just another tool — we’re your digital vault for trust."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Navbar />
      <section className="bg-[#EFE4D2] py-16 " id="about">
        <div className="min-h-screen flex items-center justify-center">
          {/* Text Section */}
          <div className="max-w-3xl text-center bg-white shadow-lg rounded-2xl p-10">
            <h2 className="text-3xl sm:text-4xl flex justify-center items-center font-bold text-[#954C2E] mb-4">
              Why SafeExpire
            </h2>
            <p className="text-gray-700 text-lg mb-4">
              In a world flooded with insecure links, spam, and privacy
              concerns, we asked one question:
              <span className="italic text-blue-500">
                {" "}
                “What if sharing sensitive data could be simple, safe, and
                temporary?”
              </span>
            </p>
            <p className="text-gray-600 mb-6">
              That’s how SafeExpire was born — a tool designed for people who
              care about digital trust. Whether you’re sharing a document, a
              password, or a private note, our system ensures it’s seen only
              once, or only for as long as you want.
            </p>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li>✅ No signup required for basic use</li>
              <li>✅ One-time & time-limited URLs</li>
              <li>✅ End-to-end encryption support (coming soon)</li>
              <li>✅ Built by developers who care about digital privacy</li>
              <li>✅ We delete your data as soon as it expire</li>
            </ul>
            <p className="text-gray-800 font-semibold">
              We’re not just another tool — we’re your digital vault for trust.
            </p>
            <p className="text-gray-800 font-semibold">
              SafeExpire will be available with more features! Analytics,
              Dashboard etc. Very Soon!
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;
