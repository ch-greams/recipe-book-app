import { CY_FOOD_PATH,CY_RECIPE_PATH } from "cypress/constants";


describe("home_page", () => {
    it("successfully loads", () => {

        cy.visit("/");

        cy.get(`a[href="${CY_RECIPE_PATH}"]`).should("be.visible");
        cy.get(`a[href="${CY_FOOD_PATH}"]`).should("be.visible");
    });
});
