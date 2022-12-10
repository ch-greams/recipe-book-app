import React, { useState } from "react";

import { BUTTON_LOGIN } from "@common/labels";
import RbaButton, { ButtonWidthSize } from "@views/shared/rba-button";
import RbaInput, { InputHeightSize, InputTextAlign, InputTheme, InputWidthSize } from "@views/shared/rba-input";

import styles from "./rba-login-page.module.scss";


const RbaLoginPage: React.FC = () => {

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    return (
        <div className={styles.loginPage}>

            <div className={styles.loginForm}>

                <RbaInput
                    theme={InputTheme.Alternative}
                    align={InputTextAlign.Left}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Large}
                    placeholder={"email"}
                    name={"username"}
                    value={email}
                    onChange={(value) => { setEmail(value); }}
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
                    onChange={(value) => { setPassword(value); }}
                />

                <RbaButton
                    label={BUTTON_LOGIN}
                    width={ButtonWidthSize.Full}
                    onClick={() => {
                        console.log("email", email, "password", password);
                    }}
                />

            </div>

        </div>
    );
};


RbaLoginPage.displayName = "RbaLoginPage";
export default RbaLoginPage;
