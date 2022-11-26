import React, { useEffect } from "react";

import { Color } from "@common/style";
import RbaSingleMessagePage from "@views/shared/rba-single-message-page";
import { useAppSelector } from "@store";
import { useAppDispatch } from "@store";
import * as journalActions from "@store/actions/journal";
import * as userActions from "@store/actions/user";
import { IconSize } from "@icons/icon-params";
import RbaIconLoading from "@icons/rba-icon-loading";

import RbaUserPage from "./rba-user-page";


const RbaUserPageConnected: React.FC = () => {

    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.user);
    const journal = useAppSelector((state) => state.journal);

    useEffect(() => {
        dispatch(userActions.fetchProducts());
        dispatch(journalActions.fetchJournalInfo());
    }, [ dispatch ]);

    return (
        user.isLoaded
            ? (
                user.errorMessage
                    ? <RbaSingleMessagePage text={user.errorMessage} />
                    : <RbaUserPage user={user} journalGroups={journal.groups} />
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
