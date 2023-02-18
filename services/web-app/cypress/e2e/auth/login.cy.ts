import * as constants from "@cypress/constants";

import { JOURNAL_PATH, LOGIN_PATH, USER_PATH } from "@common/routes";


describe("auth", () => {

    describe("login", () => {

        const USERNAME = "admin@rba.com";
        const PASSWORD = "qwerty1234";

        it("can successfully log in", () => {

            cy.visit(LOGIN_PATH);

            cy.intercept(
                `${constants.CY_AUTH_API_PATH}/login`,
                {
                    headers: { ["Set-Cookie"]: "access_token=JWT_HERE; SameSite=Strict; Path=/; Max-Age=1800" },
                    body: null,
                },
            )
                .as("authLogin");

            cy.get(`form [data-cy=${constants.CY_AUTH_USERNAME_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(USERNAME);

            cy.get(`form [data-cy=${constants.CY_AUTH_PASSWORD_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(PASSWORD);

            cy.get(`form [data-cy=${constants.CY_BUTTON}]`)
                .click();

            cy.wait("@authLogin").then(interceptedRequest => {
                const bodyText = new URLSearchParams({ username: USERNAME, password: PASSWORD }).toString();
                cy.wrap(interceptedRequest?.request?.body)
                    .should("eq", bodyText);
            });

            cy.url().should("eq", Cypress.config().baseUrl + JOURNAL_PATH);
        });

        it("can successfully redirect after log in", () => {

            cy.visit(`${LOGIN_PATH}?redirect=${USER_PATH}`);

            cy.intercept(
                `${constants.CY_AUTH_API_PATH}/login`,
                {
                    headers: { ["Set-Cookie"]: "access_token=JWT_HERE; SameSite=Strict; Path=/; Max-Age=1800" },
                    body: null,
                },
            )
                .as("authLogin");

            cy.get(`form [data-cy=${constants.CY_AUTH_USERNAME_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(USERNAME);

            cy.get(`form [data-cy=${constants.CY_AUTH_PASSWORD_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(PASSWORD);

            cy.get(`form [data-cy=${constants.CY_BUTTON}]`)
                .click();

            cy.wait("@authLogin").then(interceptedRequest => {
                const bodyText = new URLSearchParams({ username: USERNAME, password: PASSWORD }).toString();
                cy.wrap(interceptedRequest?.request?.body)
                    .should("eq", bodyText);
            });

            cy.url().should("eq", Cypress.config().baseUrl + USER_PATH);
        });

        it("can use username from page params", () => {

            cy.visit(`${LOGIN_PATH}?username=${USERNAME}`);

            cy.intercept(
                `${constants.CY_AUTH_API_PATH}/login`,
                {
                    headers: { ["Set-Cookie"]: "access_token=JWT_HERE; SameSite=Strict; Path=/; Max-Age=1800" },
                    body: null,
                },
            )
                .as("authLogin");

            cy.get(`form [data-cy=${constants.CY_AUTH_USERNAME_INPUT}][value="${USERNAME}"]`)
                .should("be.visible");

            cy.get(`form [data-cy=${constants.CY_AUTH_PASSWORD_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(PASSWORD);

            cy.get(`form [data-cy=${constants.CY_BUTTON}]`)
                .click();

            cy.wait("@authLogin").then(interceptedRequest => {
                const bodyText = new URLSearchParams({ username: USERNAME, password: PASSWORD }).toString();
                cy.wrap(interceptedRequest?.request?.body)
                    .should("eq", bodyText);
            });

            cy.url().should("eq", Cypress.config().baseUrl + JOURNAL_PATH);
        });
    });
});
