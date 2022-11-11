
# Foods 

## Food Database Research

In order to find reliable source of nutritional value estimation for recipe calculations several data sources were investigated.

### [NCCDB](http://www.ncc.umn.edu/food-and-nutrient-database/)

1. Not free to use; detailed pricing can be requested
2. Does not have an API. After purchasing the database, you're provided with excel files. Database is renewed annually
3. [Sample data](https://drive.google.com/drive/folders/1d-9zFf7hNNyxvhthzRGUV6A6HjkK7I7j)

* Makes up the bulk of foods in Cronometer's database. Contains over 17000 food entries with comprehensive data on 70 nutrients

### [USDA](https://fdc.nal.usda.gov/api-spec/fdc_api.html#/)

1. Free to use
2. Does have [an API](https://fdc.nal.usda.gov/api-spec/fdc_api.html#/). API key is [provided after signup](https://fdc.nal.usda.gov/api-key-signup.html). There is rate limit of 3,600 requests per hour per IP address and exceeding that limit will block API key for 1 hour. Permission to use higher rate can be requested
3. Data contained in FoodData Central can be downloaded [here](https://fdc.nal.usda.gov/download-datasets.html)

### [ESHA](https://esha.com/eshas-nutrition-databases-and-apis/)

1. Not free to use, detailed pricing can be requested
2. Does have [an API](https://esha.com/products/nutrition-database-api/)
3. No sample data provided for free

* Contains over 100000 food items, including over 25,000 brand-name products, more than 20,000 menu items, and common foods
* Has USDA database among its resources

### CRDB

1. Available to search through cronometer website while logged in (on a free tier)
2. Does not have a public API and [it's unlikely to be provided any time soon](https://forums.cronometer.com/discussion/3365/any-chance-a-public-api-for-cronometer-will-be-available)
3. No sample data to download

* Cronometer's own own set of user-submitted food entries

### [CNF](http://www.hc-sc.gc.ca/fn-an/nutrition/fiche-nutri-data/cnf_downloads-telechargement_fcen-eng.php)

1. Free to use
2. Does have an API. [API guide](https://produits-sante.canada.ca/api/documentation/cnf-documentation-en.html)
3. Data archive can be downloaded
4. [Complete description of database structure](https://www.canada.ca/en/health-canada/services/food-nutrition/healthy-eating/nutrient-data/canadian-nutrient-file-compilation-canadian-food-composition-data-database-structure.html)

### [Nutritionix](https://www.nutritionix.com/database)

1. Not free to use: 
2. Does have [an API](https://www.nutritionix.com/business/api). API has 4 payment plans; Free tier is up to 2 active users; MVP plan (up to 1000 active users) is $499/month
3. Database samples as well as comprehensive documentation can be downloaded [from here](https://www.nutritionix.com/database)

* Contains 809,610 grocery items, 172,917 restaurant items, 13,525 common foods

### [CoFID](https://www.gov.uk/government/publications/composition-of-foods-integrated-dataset-cofid)

1. Free to use
2. Does not have an API
3. Data is available as two parts, [both can be downloaded from here](https://www.gov.uk/government/publications/composition-of-foods-integrated-dataset-cofid)
4. Data is provided as a set of excel files related to nutrient groups

### [NEVO](https://nevo-online.rivm.nl/)

1. Free to use unchanged but must be referenced.
> Any output from software for nutritional calculations produced by the user mustContain one of the > > following references:‘Based on data from NEVO online version 2019/6.0, RIVM, Bilthoven’ or ‘Based ondata from NEVO online version 2019/6.0, RIVM, Bilthoven and other datasources’
Also, users can't be charged for the use of data that comes from this database.
> RIVM does not charge users for downloading and using NEVO online version    2019/6.0 data, The user is not allowed to charge (end)users for the use ofNEVO online version 2019/6.0 data.
2. Does not have an API.
3. Excel files [can be downloaded from here](https://www.rivm.nl/en/dutch-food-composition-database/access-nevo-data/request-dataset)

* Comes with comprehensive [documentation](https://www.rivm.nl/documenten/nevo-online-2019-background-information)
* Has [an online version](https://nevo-online.rivm.nl/)

### [NUTTAB](https://www.foodstandards.gov.au/science/monitoringnutrients/afcd/Pages/default.aspx)

1. Free to use [under the following conditions](https://www.foodstandards.gov.au/science/monitoringnutrients/afcd/Pages/datauserlicenceagreement.aspx); [human-readable explanation](https://creativecommons.org/licenses/by-sa/3.0/au/deed.en)
2. Does not have an API
3. Excel files [can be downloaded from here](https://www.foodstandards.gov.au/science/monitoringnutrients/afcd/Pages/downloadableexcelfiles.aspx)
4. Excel database comprises 5 core files (Food, Nutrient, Recipe, Retention factor, Measures)

## Conclusions

### For consideration

Apart from ease of use and price for using the data, I found that there are two distinct approaches combined in the development of most nutrition databases:

* Generic data collection: nutritional dataset gives approximate values for certain products known to vary in nutritional content. 
    * Less items needed to comprehensiveness
    * Less precise

* Gather more available items with nutritional data provided by manufacturer
    * Allows better precision
    * Manufacturers often provide limited information on nutrients beyond macros
    * Nutritional value of certain products may vary in different countries (e.g. sugar content of Coca-Cola)


### Viable options for MVP:

* USDA
    * Easy to use
    * Free
    * Comprehensive
* CNF
    * Free
    * Comprehensive

For further consideration:
* Nutritionix 
    * Easy to use
    * Comprehensive
    * Pricey
