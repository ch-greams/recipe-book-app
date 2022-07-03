import superagent from "superagent";
import { JSDOM } from "jsdom";
import fs from "fs";


const DATA_FOLDER = "./data";


async function getDocument(url) {
    const response = await superagent.get(url);
    const page = new JSDOM(response.text);

    return page.window.document;
}

//------------------------------------------------------------------------------

function getCategories(document) {
    return [ ...document.querySelectorAll(".recipe-block a") ]
        .reduce((previousValue, currentValue) => ([ ...previousValue, currentValue.href ]), []);
}

function getRecipes(document) {
    return [ ...document.querySelectorAll("a[id^='gtm_recipe_'][href^='/recipes']") ]
        .reduce((previousValue, currentValue) => ([ ...previousValue, currentValue.href ]), [])
}

//------------------------------------------------------------------------------

let _recipes = [];
let _categories_checked = 0;

async function recursiveScrape(url) {
    const document = await getDocument(url);

    const recipes = getRecipes(document);

    if (recipes.length > 0) {
        // recipes

        _recipes = _recipes.concat(recipes);
        // console.log("recipes", recipes);

        console.log("_categories_checked", ++_categories_checked);
    }
    else {
        // categories

        const categories = getCategories(document);
        // console.log("categories", categories);

        for (const category of categories) {
            await recursiveScrape(category);
        }
    }
}

//------------------------------------------------------------------------------

await recursiveScrape("https://www.jamieoliver.com/recipes/category/ingredient/");


console.log("all recipes", _recipes.length);

const unique_recipes = [ ...new Set(_recipes) ].map((url) => `https://www.jamieoliver.com${url}`);

console.log("unique recipes", unique_recipes.length);

fs.writeFileSync(`${DATA_FOLDER}/recipes.json`, JSON.stringify(unique_recipes, null, 4));

