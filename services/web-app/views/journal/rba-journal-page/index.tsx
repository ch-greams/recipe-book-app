import React, { useEffect } from "react";

import { Color } from "@common/colors";
import RbaSingleMessagePage from "@views/shared/rba-single-message-page";
import { useAppSelector } from "@store";
import { useAppDispatch } from "@store";
import * as actions from "@store/actions/journal";
import { IconSize } from "@icons/icon-params";
import RbaIconLoading from "@icons/rba-icon-loading";

import RbaJournalPage from "./rba-journal-page";


const RbaJournalPageConnected: React.FC = () => {

    const dispatch = useAppDispatch();

    const meta = useAppSelector((state) => state.meta);
    const journal = useAppSelector((state) => state.journal);

    useEffect(() => {
        dispatch(actions.fetchJournalInfo());
    }, [ dispatch ]);

    return (
        journal.isLoaded
            ? (
                journal.errorMessage
                    ? <RbaSingleMessagePage text={journal.errorMessage} />
                    : <RbaJournalPage journal={journal} meta={meta} />
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
