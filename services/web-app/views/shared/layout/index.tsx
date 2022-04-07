import React from "react";
import Head from "next/head";

import Footer from "../footer";
import Navbar from "../navbar";


const Layout: React.FC = ({ children }) => {
    return (
      <>
        <Head>
          <title>{"RecipeBook"}</title>
        </Head>
        <Navbar />
        <div>{children}</div>
        <Footer />
      </>
    );
};


Layout.displayName = "Layout";

export default Layout;
