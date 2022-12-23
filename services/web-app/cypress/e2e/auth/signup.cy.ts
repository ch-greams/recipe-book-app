import * as constants from "@cypress/constants";

import { HttpStatus } from "@common/http";


describe("auth", () => {

    describe("signup", () => {

        const USERNAME = "admin@rba.com";
        const PASSWORD = "qwerty1234";
        const FIRST_NAME = "Andrei";
        const LAST_NAME = "Greams";

        it("can successfully sign up", () => {

            cy.visit(constants.CY_SIGNUP_PATH);

            cy.intercept(`${constants.CY_AUTH_API_PATH}/signup`, { statusCode: HttpStatus.Created })
                .as("authSignup");

            cy.get(`form [data-cy=${constants.CY_AUTH_USERNAME_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(USERNAME);

            cy.get(`form [data-cy=${constants.CY_AUTH_FIRST_NAME_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(FIRST_NAME);

            cy.get(`form [data-cy=${constants.CY_AUTH_LAST_NAME_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(LAST_NAME);

            cy.get(`form [data-cy=${constants.CY_AUTH_PASSWORD_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(PASSWORD);

            cy.get(`form [data-cy=${constants.CY_BUTTON}]`)
                .click();

            cy.wait("@authSignup").then(interceptedRequest => {
                const formParams = {
                    email: USERNAME,
                    first_name: FIRST_NAME,
                    last_name: LAST_NAME,
                    password: PASSWORD,
                };
                const bodyText = new URLSearchParams(formParams).toString();
                cy.wrap(interceptedRequest?.request?.body)
                    .should("eq", bodyText);
            });

            cy.url().should("eq", `${Cypress.config().baseUrl}${constants.CY_LOGIN_PATH}?username=${USERNAME}`);

            cy.get(`form [data-cy=${constants.CY_AUTH_USERNAME_INPUT}][value="${USERNAME}"]`)
                .should("be.visible");
        });
    });
});
