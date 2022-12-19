import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { useLoginRedirect } from "@common/hooks";
import { Color } from "@common/style";
import RbaSingleMessagePage from "@views/shared/rba-single-message-page";
import { useAppSelector } from "@store";
import { useAppDispatch } from "@store";
import * as journalActions from "@store/actions/journal";
import type { MetaStore } from "@store/types/meta";
import type { UserStore } from "@store/types/user";
import { IconSize } from "@icons/icon-params";
import RbaIconLoading from "@icons/rba-icon-loading";

import RbaUserPage from "./rba-user-page";


interface Props {
    user: UserStore;
    meta: MetaStore;
}

const RbaUserPageConnected: React.FC<Props> = ({ meta, user }) => {

    const dispatch = useAppDispatch();

    const { journal } = useAppSelector((state) => state);

    useLoginRedirect(user.isLoggedIn);

    useEffect(() => { dispatch(journalActions.fetchJournalInfo()); }, [ dispatch ]);

    return (
        user.isLoaded && meta.isLoaded && journal.isLoaded
            ? (
                user.errorMessage
                    ? <RbaSingleMessagePage text={user.errorMessage} />
                    : (
                        <RbaUserPage
                            user={user}
                            journalGroups={journal.groups}
                            nutrientDescriptions={meta.nutrientDescriptions}
                        />
                    )
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
