import * as constants from "@cypress/constants";

import { HOME_PATH } from "@common/routes";


describe("home_page", () => {
    it("successfully loads", () => {

        cy.visit(HOME_PATH);

        cy.get(`a[href="${constants.CY_NEW_RECIPE_PATH}"]`).should("be.visible");
        cy.get(`a[href="${constants.CY_NEW_FOOD_PATH}"]`).should("be.visible");
    });
});
