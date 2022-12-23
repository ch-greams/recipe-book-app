import { useEffect } from "react";
import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import { useAppDispatch, useAppSelector } from "@store";
import { fetchNutrients } from "@store/actions/meta";
import { fetchUserData } from "@store/actions/user";

import RbaFooter from "../rba-footer";
import RbaNavbar from "../rba-navbar";


interface Props {
    page: AppProps;
}

const RbaLayout: React.FC<Props> = ({ page: { Component, pageProps } }) => {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const { user, meta } = useAppSelector((state) => state);

    useEffect(() => {
        if (!meta.isLoaded && !meta.isLoading) {
            dispatch(fetchNutrients());
        }
    }, [ meta.isLoaded, meta.isLoading ]);

    useEffect(() => { dispatch(fetchUserData()); }, [ user.userId ]);


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

            <Component
                user={user}
                meta={meta}
                {...pageProps}
            />

            <RbaFooter />
        </>
    );
};


RbaLayout.displayName = "RbaLayout";

export default RbaLayout;
