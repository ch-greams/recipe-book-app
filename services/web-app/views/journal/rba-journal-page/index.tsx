import React, { useEffect } from "react";

import { changeDate } from "@common/date";
import { useLoginRedirect } from "@common/hooks";
import { Color } from "@common/style";
import RbaSingleMessagePage from "@views/shared/rba-single-message-page";
import { useAppDispatch, useAppSelector } from "@store";
import * as actions from "@store/actions/journal";
import type { MetaStore } from "@store/types/meta";
import type { UserStore } from "@store/types/user";
import { IconSize } from "@icons/icon-params";
import RbaIconLoading from "@icons/rba-icon-loading";

import RbaJournalPage from "./rba-journal-page";


interface Props {
    user: UserStore;
    meta: MetaStore;
}

const RbaJournalPageConnected: React.FC<Props> = ({ meta, user }) => {

    const dispatch = useAppDispatch();

    const { journal, search } = useAppSelector((state) => state);

    useLoginRedirect(user.isLoggedIn);

    useEffect(() => { dispatch(actions.fetchJournalInfo()); }, [ journal.currentDate ]);

    return (
        journal.isLoaded
            ? (
                journal.errorMessage
                    ? <RbaSingleMessagePage text={journal.errorMessage} />
                    : (
                        <RbaJournalPage
                            journal={journal}
                            user={user}
                            meta={meta}
                            search={search}
                            decrementDate={() => dispatch(actions.updateDate(changeDate(journal.currentDate, -1)))}
                            incrementDate={() => dispatch(actions.updateDate(changeDate(journal.currentDate, 1)))}
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

RbaJournalPageConnected.displayName = "RbaJournalPageConnected";


export default RbaJournalPageConnected;
