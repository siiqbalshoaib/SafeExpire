import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";
import { Helmet } from "react-helmet";

const FAQ = () => {
  const faqs = [
    {
      question: "What is SafeExpire?",
      answer:
        "SafeExpire is a secure platform that allows you to share links or files that expire after a specific time or number of uses — ensuring your data doesn’t stay online forever."
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. All uploads are encrypted, and access is strictly limited to your defined expiration rules. We never store data beyond its expiration."
    },
    {
      question: "Do I need to create an account?",
      answer:
        "No, you can generate temporary links without signing up. However, signing up gives you access to more features like link management, usage stats, and higher limits."
    },
    {
      question: "How long does a link stay active?",
      answer:
        "You decide! You can set it to expire after a specific number of views or after a certain amount of time (e.g., 1 hour, 24 hours, 7 days)."
    },
    {
      question: "Can I delete a link manually?",
      answer:
        "Yes, if you're a registered user, you can manually expire or delete your links anytime through your dashboard."
    },
    {
      question: "Is there a file upload limit?",
      answer:
        "Yes. On the free plan, uploads are limited to text only. Paid plans offer file upload support with size limits depending on your subscription tier."
    }
  ];

  return (
    <>
    <Helmet>
      <title>faq</title>
      <meta name="title" content="faq" />
      <meta name="description" content="faq page" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="/faq" />
    </Helmet>
    <Navbar/>
    <section className="bg-[#EFE4D2]  py-16" id="faq">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-blue-600 mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-6 bg-gray-50 shadow-sm hover:shadow-md transition duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {item.question}
              </h3>
              <p className="text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    <Footer/>
    </>
  );
};

export default FAQ;
