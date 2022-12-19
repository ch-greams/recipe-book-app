import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";

import { BUTTON_LOG_IN } from "@common/labels";
import { isSome } from "@common/types";
import RbaButton, { ButtonWidthSize } from "@views/shared/rba-button";
import RbaInput, { InputHeightSize, InputTextAlign, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import { login } from "@store/actions/user";
import { useAppDispatch } from "@store/index";

import styles from "./rba-login-page.module.scss";


interface LoginPageQuery extends ParsedUrlQuery {
    username?: string;
    redirect?: string;
}

const RbaLoginPage: React.FC = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const query: LoginPageQuery = router.query;

    useEffect(() => {
        if (isSome(query.username)) {
            setUserName(query.username);
        }
    }, [ query.username ]);

    const [ username, setUserName ] = useState("");
    const [ password, setPassword ] = useState("");

    return (
        <div className={styles.loginPage}>

            <form
                className={styles.loginForm}
                onSubmit={async (event) => {
                    event.preventDefault();
                    const response = await dispatch(login({ username, password }));

                    if (response.meta.requestStatus === "fulfilled") {
                        router.push(isSome(query.redirect) ? query.redirect : "/journal");
                    }
                }}
            >

                <RbaInput
                    theme={InputTheme.Alternative}
                    align={InputTextAlign.Left}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Large}
                    placeholder={"email"}
                    name={"username"}
                    value={username}
                    onChange={setUserName}
                />

                <RbaInput
                    theme={InputTheme.Alternative}
                    align={InputTextAlign.Left}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Large}
                    placeholder={"password"}
                    name={"password"}
                    hidden={true}
                    value={password}
                    onChange={setPassword}
                />

                <RbaButton
                    label={BUTTON_LOG_IN}
                    type={"submit"}
                    width={ButtonWidthSize.Full}
                />

            </form>

        </div>
    );
};


RbaLoginPage.displayName = "RbaLoginPage";
export default RbaLoginPage;
