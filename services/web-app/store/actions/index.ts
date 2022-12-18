import type { HttpStatus } from "@common/http";

import type { RootState } from "..";


export interface AsyncThunkConfig {
    state: RootState;
    rejectValue: HttpStatus;
}
