import React, { useState } from "react";

import { BUTTON_LOG_IN } from "@common/labels";
import RbaButton, { ButtonWidthSize } from "@views/shared/rba-button";
import RbaInput, { InputHeightSize, InputTextAlign, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import { login } from "@store/actions/user";
import { useAppDispatch } from "@store/index";

import styles from "./rba-login-page.module.scss";


const RbaLoginPage: React.FC = () => {

    const dispatch = useAppDispatch();

    const [ username, setUserName ] = useState("");
    const [ password, setPassword ] = useState("");

    return (
        <div className={styles.loginPage}>

            <form
                className={styles.loginForm}
                onSubmit={(event) => {
                    event.preventDefault();
                    dispatch(login({ username, password }));
                }}
            >

                <RbaInput
                    theme={InputTheme.Alternative}
                    align={InputTextAlign.Left}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Large}
                    placeholder={"username"}
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
