import * as constants from "@cypress/constants";


describe("home_page", () => {
    it("successfully loads", () => {

        cy.visit(constants.CY_HOME_PATH);

        cy.get(`a[href="${constants.CY_NEW_RECIPE_PATH}"]`).should("be.visible");
        cy.get(`a[href="${constants.CY_NEW_FOOD_PATH}"]`).should("be.visible");
    });
});
