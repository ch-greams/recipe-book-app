import React, { useState } from "react";
import { useRouter } from "next/router";

import { BUTTON_SIGN_UP } from "@common/labels";
import RbaButton, { ButtonWidthSize } from "@views/shared/rba-button";
import RbaInput, { InputHeightSize, InputTextAlign, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import { signup } from "@store/actions/user";
import { useAppDispatch } from "@store/index";

import styles from "./rba-signup-page.module.scss";


const RbaSignupPage: React.FC = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const [ username, setUserName ] = useState("");
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ password, setPassword ] = useState("");

    return (
        <div className={styles.signupPage}>

            <form
                className={styles.signupForm}
                onSubmit={async (event) => {
                    event.preventDefault();
                    const response = await dispatch(signup({ username, firstName, lastName, password }));

                    if (response.meta.requestStatus === "fulfilled") {
                        router.push(`/login?username=${username}`);
                    }
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
                    placeholder={"first name"}
                    name={"first_name"}
                    value={firstName}
                    onChange={setFirstName}
                />

                <RbaInput
                    theme={InputTheme.Alternative}
                    align={InputTextAlign.Left}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Large}
                    placeholder={"last name"}
                    name={"last_name"}
                    value={lastName}
                    onChange={setLastName}
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
                    label={BUTTON_SIGN_UP}
                    type={"submit"}
                    width={ButtonWidthSize.Full}
                />

            </form>

        </div>
    );
};


RbaSignupPage.displayName = "RbaSignupPage";
export default RbaSignupPage;
