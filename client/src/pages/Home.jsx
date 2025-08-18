import React from "react";

import Linkform from "../components/Linkform";
import Cards from "../components/Cards";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Home</title>
        <meta
          name="title"
          content="Exclusive Self Destructing File Sharing You'll Love"
        />
        <meta
          name="description"
          content="Explore exclusive self destructing file sharing solutions you'll actually use. Secure file transfers with automatic deletion for complete privacy."
        />
        <meta
          name="keywords"
          content="temp file, Share file with expiry date, self destructing file sharing, secure file sharing link, temporary file link generator, self destructing photo sharing, share link file with expiration date, temp file upload, pdf share link expiry, share file with expiry date"
        />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Navbar />
      <Linkform />
      <Cards />
      <Footer />
    </>
  );
};

export default Home;
