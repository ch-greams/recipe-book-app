import superagent from "superagent";
import { JSDOM } from "jsdom";
import fs from "fs";


const DATA_FOLDER = "./data";


const recipe_urls = JSON.parse( fs.readFileSync(`${DATA_FOLDER}/recipes.json`, { encoding: "utf8" }) );


let _errors = [];


async function getDocument(url) {

    try {
        const response = await superagent.get(url);
        // console.log("response", response.text);
        const page = new JSDOM(response.text);
    
        return page.window.document;
    }
    catch (error) {
        _errors.push(error);

        console.log("_errors.length", _errors.length);
        return null;
    }
}

//------------------------------------------------------------------------------

function getText(element) {
    return element.textContent.trim().replace(/\s\s+/g, ' ');
}

function getRecipe(url, document) {

    console.log(`parsing ${url} ...`);

    const ingredients = [ ...document.querySelectorAll(".ingred-list li") ]
        .reduce((previousValue, currentValue) => ([ ...previousValue, getText(currentValue) ]), []);

    const directions = [ ...document.querySelectorAll(".recipeSteps li") ]
        .reduce((previousValue, currentValue) => ([ ...previousValue, getText(currentValue) ]), []);

    const tags = [ ...document.querySelectorAll(".tags-list a") ]
        .reduce((previousValue, currentValue) => ([ ...previousValue, getText(currentValue) ]), []);


    return { url, ingredients, directions, tags };
}

//------------------------------------------------------------------------------

let _recipes = [];
let _recipes_checked = 1900;

const urls = recipe_urls.slice(1899);

for (const recipe_url of urls) {

    const recipe_document = await getDocument(recipe_url);

    if (recipe_document) {
        const recipe_full = getRecipe(recipe_url, recipe_document);
        _recipes.push(recipe_full);
    }

    console.log("_recipes_checked", ++_recipes_checked);

    if (_recipes_checked % 100 === 0) {

        fs.writeFileSync(`${DATA_FOLDER}/recipes_full_${_recipes_checked}.json`, JSON.stringify(_recipes, null, 4));

        fs.writeFileSync(`${DATA_FOLDER}/errors_${_errors.length}.json`, JSON.stringify(_errors, null, 4));

        _recipes = [];
    }
}

fs.writeFileSync(`${DATA_FOLDER}/recipes_full_${_recipes_checked}.json`, JSON.stringify(_recipes, null, 4));

fs.writeFileSync(`${DATA_FOLDER}/errors_${_errors.length}.json`, JSON.stringify(_errors, null, 4));
