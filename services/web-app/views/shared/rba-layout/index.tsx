import type { PropsWithChildren } from "react";
import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { useAppSelector } from "@store";

import RbaFooter from "../rba-footer";
import RbaNavbar from "../rba-navbar";


const RbaLayout: React.FC<PropsWithChildren> = ({ children }) => {

    const user = useAppSelector((state) => state.user);

    const router = useRouter();
    const isHomePage = (router.pathname === "/");

    return (
        <>
            <Head>
                <title>{"RecipeBook"}</title>
            </Head>
            <RbaNavbar hideSearch={isHomePage} username={user.userName} />
            <div>{children}</div>
            <RbaFooter />
        </>
    );
};


RbaLayout.displayName = "RbaLayout";

export default RbaLayout;
