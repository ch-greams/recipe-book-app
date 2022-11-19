import React, { useEffect } from "react";

import { changeDate } from "@common/date";
import { Color } from "@common/style";
import RbaSingleMessagePage from "@views/shared/rba-single-message-page";
import { useAppDispatch, useAppSelector } from "@store";
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
    }, [ dispatch, journal.currentDate ]);

    return (
        journal.isLoaded
            ? (
                journal.errorMessage
                    ? <RbaSingleMessagePage text={journal.errorMessage} />
                    : (
                        <RbaJournalPage
                            journal={journal}
                            meta={meta}
                            decrementDate={() => dispatch(actions.changeDate(changeDate(journal.currentDate, -1)))}
                            incrementDate={() => dispatch(actions.changeDate(changeDate(journal.currentDate, 1)))}
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
