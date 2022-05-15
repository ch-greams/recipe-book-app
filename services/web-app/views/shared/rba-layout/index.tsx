import React from "react";
import Head from "next/head";

import RbaFooter from "../rba-footer";
import RbaNavbar from "../rba-navbar";


const RbaLayout: React.FC = ({ children }) => {
    return (
        <>
            <Head>
                <title>{"RecipeBook"}</title>
            </Head>
            <RbaNavbar username={"Andrei Khvalko"} />
            <div>{children}</div>
            <RbaFooter />
        </>
    );
};


RbaLayout.displayName = "RbaLayout";

export default RbaLayout;
