import React, { useEffect } from "react";

import { Color } from "@common/colors";
import RbaSingleMessagePage from "@views/shared/rba-single-message-page";
import { useAppSelector } from "@store";
import { useAppDispatch } from "@store";
import * as actions from "@store/user/actions";
import { IconSize } from "@icons/icon-params";
import RbaIconLoading from "@icons/rba-icon-loading";

import RbaUserPage from "./rba-user-page";


const RbaUserPageConnected: React.FC = () => {

    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.user);

    useEffect(() => {
        dispatch(actions.fetchFoods());
        dispatch(actions.fetchRecipes());
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
