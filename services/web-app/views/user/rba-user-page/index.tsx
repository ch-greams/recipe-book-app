import React from "react";

import { useLoginRedirect } from "@common/hooks";
import { Color } from "@common/style";
import RbaSingleMessagePage from "@views/shared/rba-single-message-page";
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

    useLoginRedirect(user.isLoggedIn);

    return (
        user.isLoaded && meta.isLoaded
            ? (
                user.errorMessage
                    ? <RbaSingleMessagePage text={user.errorMessage} />
                    : (
                        <RbaUserPage
                            user={user}
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
