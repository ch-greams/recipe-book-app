import React from "react";

import Footer from "../footer";
import Navbar from "../navbar";

const Layout: React.FC = ({ children }) => {
    return (
      <>
        <Navbar />
        <div>{children}</div>
        <Footer />
      </>
    );
};


Layout.displayName = "Layout";

export default Layout;
