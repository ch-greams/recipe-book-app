import React, { useState } from "react";

import { BUTTON_LOGIN } from "@common/labels";
import RbaButton, { ButtonWidthSize } from "@views/shared/rba-button";
import RbaInput, { InputHeightSize, InputTextAlign, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import AuthApi from "@api/loginApi";

import styles from "./rba-login-page.module.scss";


const RbaLoginPage: React.FC = () => {

    const [ username, setUserName ] = useState("");
    const [ password, setPassword ] = useState("");

    return (
        <div className={styles.loginPage}>

            <form
                className={styles.loginForm}
                onSubmit={(event) => {
                    event.preventDefault();
                    AuthApi.login(username, password);
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
                    label={BUTTON_LOGIN}
                    type={"submit"}
                    width={ButtonWidthSize.Full}
                />

            </form>

        </div>
    );
};


RbaLoginPage.displayName = "RbaLoginPage";
export default RbaLoginPage;
