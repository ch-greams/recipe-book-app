import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Color } from "@common/colors";
import RbaSingleMessagePage from "@views/shared/rba-single-message-page";
import type { AppState } from "@store";
import * as actions from "@store/user/actions";
import type { UserStore } from "@store/user/types";
import { IconSize } from "@icons/icon-params";
import RbaIconLoading from "@icons/rba-icon-loading";

import RbaUserPage from "./rba-user-page";


const RbaUserPageConnected: React.FC = () => {

    const dispatch = useDispatch();

    const user = useSelector<AppState>((state) => state.user) as UserStore;

    useEffect(() => {
        dispatch(actions.requestFoods());
        dispatch(actions.requestRecipes());
    }, [ dispatch ]);

    return (
        user.isLoaded
            ? (
                user.errorMessage
                    ? <RbaSingleMessagePage text={user.errorMessage} />
                    : <RbaUserPage user={user} />
            )
            : (
                <RbaSingleMessagePage>
                    <RbaIconLoading size={IconSize.ExtraLarge} color={Color.White} />
                </RbaSingleMessagePage>
            )
    );
};

RbaUserPageConnected.displayName = "RbaUserPageConnected";


export default RbaUserPageConnected;
