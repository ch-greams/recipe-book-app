import React from "react";
import { useSelector } from "react-redux";
import Head from "next/head";
import { useRouter } from "next/router";

import type { AppState } from "@store";
import type { UserStore } from "@store/user/types";

import RbaFooter from "../rba-footer";
import RbaNavbar from "../rba-navbar";


const RbaLayout: React.FC = ({ children }) => {

    const user = useSelector<AppState>((state) => state.user) as UserStore;

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
