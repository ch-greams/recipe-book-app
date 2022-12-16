import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { useAppDispatch, useAppSelector } from "@store";
import { fetchNutrients } from "@store/actions/meta";

import RbaFooter from "../rba-footer";
import RbaNavbar from "../rba-navbar";


const RbaLayout: React.FC<PropsWithChildren> = ({ children }) => {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const { user, meta } = useAppSelector((state) => state);

    useEffect(() => {
        if (!meta.isLoaded && !meta.isLoading) {
            dispatch(fetchNutrients());
        }
    }, [ meta.isLoaded, meta.isLoading ]);

    useEffect(() => {
        router.push(user.isLoggedIn ? "/" : "/login");
    }, [ user.isLoggedIn ]);

    const hideSearch = [ "/", "/login" ].includes(router.pathname);

    return (
        <>
            <Head>
                <title>{"RecipeBook"}</title>
            </Head>

            <RbaNavbar
                hideSearch={hideSearch}
                isLoggedIn={user.isLoggedIn}
                username={user.userName}
            />

            <div>{children}</div>

            <RbaFooter />
        </>
    );
};


RbaLayout.displayName = "RbaLayout";

export default RbaLayout;
