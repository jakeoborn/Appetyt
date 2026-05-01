#!/usr/bin/env node
// Add bestOf editorial rankings for cities that have zero bestOf data.
// Assignments are based on critical consensus: Michelin, James Beard,
// Eater, Infatuation, Bon Appétit, and longstanding local reputation.
// Run: node scripts/add-bestof-cities.js

const fs = require('fs');
const path = require('path');

const BESTOF = {
  CHICAGO_DATA: [
    { name: 'Alinea',                     bestOf: ['#1 Best Overall','#1 Best Tasting Menu','#1 Best Fine Dining'] },
    { name: 'Smyth',                       bestOf: ['#2 Best Tasting Menu','#2 Best Fine Dining'] },
    { name: 'Girl & the Goat',             bestOf: ['#1 Best New American','#1 Best Date Night'] },
    { name: 'Avec',                        bestOf: ['#2 Best Date Night','#1 Best Mediterranean'] },
    { name: 'Au Cheval',                   bestOf: ['#1 Best Burger','#1 Best Late Night'] },
    { name: "Pequod's Pizza",              bestOf: ['#1 Best Deep Dish Pizza'] },
    { name: "Lou Malnati's Pizzeria",      bestOf: ['#2 Best Deep Dish Pizza'] },
    { name: 'Topolobampo',                 bestOf: ['#1 Best Mexican Fine Dining','#3 Best Fine Dining'] },
    { name: 'Frontera Grill',              bestOf: ['#2 Best Mexican','#2 Best Brunch'] },
    { name: "Johnnie's Beef",              bestOf: ['#1 Best Italian Beef'] },
    { name: "Portillo's",                  bestOf: ['#2 Best Italian Beef','#1 Best Chicago Dog'] },
    { name: "Gene & Jude's",               bestOf: ['#2 Best Hot Dog'] },
    { name: 'Honey Butter Fried Chicken',  bestOf: ['#1 Best Fried Chicken'] },
    { name: "Bavette's Bar & Boeuf",       bestOf: ['#1 Best Steakhouse','#3 Best Date Night'] },
    { name: 'Gibsons Bar & Steakhouse',    bestOf: ['#2 Best Steakhouse'] },
    { name: 'The Violet Hour',             bestOf: ['#1 Best Cocktails'] },
    { name: 'Publican',                    bestOf: ['#1 Best Beer Hall','#1 Best Pork'] },
    { name: 'Parachute',                   bestOf: ['#1 Best Neighborhood','#1 Best Brunch'] },
    { name: 'RPM Italian',                 bestOf: ['#1 Best Italian','#2 Best Celebration'] },
    { name: 'Boka Restaurant',             bestOf: ['#4 Best Fine Dining','#4 Best Date Night'] },
  ],

  LA_DATA: [
    { name: 'n/naka',                           bestOf: ['#1 Best Omakase','#1 Best Fine Dining','#1 Best Overall'] },
    { name: 'Bestia',                           bestOf: ['#1 Best Italian','#1 Best Date Night'] },
    { name: 'Vespertine',                       bestOf: ['#2 Best Tasting Menu','#2 Best Fine Dining'] },
    { name: 'Spago',                            bestOf: ['#1 Best Classic LA','#3 Best Fine Dining'] },
    { name: 'Majordomo',                        bestOf: ['#1 Best New American','#2 Best Overall'] },
    { name: "Langer's Delicatessen-Restaurant", bestOf: ['#1 Best Pastrami','#1 Best Deli'] },
    { name: "Father's Office",                  bestOf: ['#1 Best Burger'] },
    { name: "Jon & Vinny's Fairfax",            bestOf: ['#1 Best Pasta','#1 Best Casual Italian'] },
    { name: "Howlin' Ray's",                    bestOf: ['#1 Best Fried Chicken','#1 Best Hot Chicken'] },
    { name: 'Republique',                       bestOf: ['#1 Best Brunch','#1 Best French'] },
    { name: 'SUGARFISH',                        bestOf: ['#1 Best Sushi (Casual)'] },
    { name: 'Osteria Mozza',                    bestOf: ['#2 Best Italian','#2 Best Date Night'] },
    { name: 'Guerrilla Tacos',                  bestOf: ['#1 Best Tacos','#1 Best Street Food'] },
  ],

  AUSTIN_DATA: [
    { name: 'Franklin Barbecue',      bestOf: ['#1 Best BBQ','#1 Best Overall','#1 Best Brisket'] },
    { name: 'Suerte',                  bestOf: ['#1 Best Mexican','#1 Best Tacos','#1 Best Date Night'] },
    { name: 'Hestia',                  bestOf: ['#1 Best Fine Dining','#2 Best Date Night','#2 Best Overall'] },
    { name: 'Emmer & Rye',             bestOf: ['#1 Best Tasting Menu','#3 Best Fine Dining'] },
    { name: 'Nixta Taqueria',          bestOf: ['#2 Best Tacos','#2 Best Mexican'] },
    { name: 'Uchi',                    bestOf: ['#1 Best Japanese','#1 Best Sushi','#3 Best Date Night'] },
    { name: 'Odd Duck',                bestOf: ['#1 Best New American'] },
    { name: 'la Barbecue',             bestOf: ['#2 Best BBQ','#2 Best Brisket'] },
    { name: "Valentina's Tex Mex BBQ", bestOf: ['#1 Best Breakfast Tacos','#3 Best BBQ'] },
    { name: 'Kemuri Tatsu-ya',         bestOf: ['#1 Best Japanese BBQ','#4 Best Overall'] },
    { name: 'Barley Swine',            bestOf: ['#4 Best Fine Dining','#3 Best New American'] },
  ],

  SLC_DATA: [
    { name: "Valter's Osteria", bestOf: ['#1 Best Italian','#1 Best Date Night','#1 Best Fine Dining'] },
    { name: 'Takashi',           bestOf: ['#1 Best Sushi','#1 Best Japanese'] },
    { name: 'Log Haven',         bestOf: ['#2 Best Fine Dining','#2 Best Date Night','#2 Best Overall'] },
    { name: 'Handle',            bestOf: ['#1 Best New American','#3 Best Date Night'] },
    { name: 'HSL',               bestOf: ['#2 Best New American','#3 Best Fine Dining'] },
    { name: 'Uchi',              bestOf: ['#1 Best Omakase','#3 Best Japanese'] },
    { name: 'Urban Hill',        bestOf: ['#4 Best Fine Dining','#1 Best Brunch'] },
    { name: 'Crown Burgers',     bestOf: ['#1 Best Pastrami Burger','#1 Best Burger'] },
    { name: 'Red Iguana',        bestOf: ['#1 Best Mexican','#1 Best Mole'] },
    { name: 'Riverhorse on Main',bestOf: ['#1 Best Park City Fine Dining','#1 Best Celebration'] },
  ],

  SEATTLE_DATA: [
    { name: 'Canlis',                      bestOf: ['#1 Best Fine Dining','#1 Best Date Night','#1 Best Overall'] },
    { name: 'Archipelago',                 bestOf: ['#2 Best Fine Dining','#1 Best Tasting Menu','#2 Best Overall'] },
    { name: 'Sushi Kashiba',               bestOf: ['#1 Best Sushi','#1 Best Omakase','#1 Best Japanese'] },
    { name: 'The Walrus and the Carpenter',bestOf: ['#1 Best Oysters','#1 Best Seafood Bar'] },
    { name: 'Altura',                      bestOf: ['#3 Best Fine Dining','#2 Best Date Night'] },
    { name: 'Cascina Spinasse',            bestOf: ['#1 Best Italian','#3 Best Date Night'] },
    { name: 'Musang',                      bestOf: ['#1 Best Filipino','#1 Best Neighborhood'] },
    { name: 'Canon',                       bestOf: ['#1 Best Cocktails','#1 Best Whiskey Bar'] },
    { name: "Dick's Drive-In",             bestOf: ['#1 Best Burger','#1 Best Late Night'] },
    { name: 'Din Tai Fung',                bestOf: ['#1 Best Dumplings','#1 Best Chinese'] },
  ],

  PHX_DATA: [
    { name: 'Pizzeria Bianco',             bestOf: ['#1 Best Pizza','#1 Best Overall'] },
    { name: 'Kai Restaurant',              bestOf: ['#1 Best Fine Dining','#1 Best Tasting Menu','#2 Best Overall'] },
    { name: 'FnB Restaurant',              bestOf: ['#1 Best New American','#1 Best Date Night'] },
    { name: 'Bacanora',                    bestOf: ['#1 Best Mexican','#1 Best Sonoran'] },
    { name: "Matt's Big Breakfast",        bestOf: ['#1 Best Breakfast','#1 Best Brunch'] },
    { name: 'Tacos Chiwas',               bestOf: ['#1 Best Tacos'] },
  ],

  LV_DATA: [
    { name: 'Joël Robuchon',              bestOf: ['#1 Best Fine Dining','#1 Best Overall','#1 Best Tasting Menu'] },
    { name: 'Restaurant Guy Savoy',        bestOf: ['#2 Best Fine Dining','#2 Best Tasting Menu'] },
    { name: 'é by José Andrés',            bestOf: ['#3 Best Fine Dining','#3 Best Tasting Menu'] },
    { name: 'Carbone Riviera',             bestOf: ['#1 Best Italian','#1 Best Date Night'] },
    { name: 'Bazaar Meat by José Andrés',  bestOf: ['#1 Best Steakhouse','#2 Best Date Night'] },
    { name: "Esther's Kitchen",            bestOf: ['#1 Best Off-Strip','#2 Best Italian'] },
    { name: 'Lotus of Siam',               bestOf: ['#1 Best Thai','#1 Best Local Fave'] },
    { name: 'Tacos El Gordo',              bestOf: ['#1 Best Tacos','#1 Best Late Night'] },
    { name: 'Herbs & Rye',                 bestOf: ['#1 Best Cocktails','#1 Best Off-Strip Bar'] },
    { name: "Momofuku",                    bestOf: ['#1 Best Ramen','#1 Best Asian Casual'] },
  ],

  SD_DATA: [
    { name: 'Addison at The Fairmont Grand Del Mar', bestOf: ['#1 Best Fine Dining','#1 Best Tasting Menu','#1 Best Overall'] },
    { name: 'Valle at Mission Pacific Hotel',        bestOf: ['#1 Best Mexican Fine Dining','#2 Best Fine Dining'] },
    { name: 'Soichi Sushi',                          bestOf: ['#1 Best Omakase','#1 Best Sushi','#1 Best Japanese'] },
    { name: 'Jeune et Jolie',                        bestOf: ['#1 Best French','#1 Best Date Night'] },
    { name: 'Juniper & Ivy',                         bestOf: ['#1 Best New American','#2 Best Date Night'] },
    { name: 'Born and Raised',                       bestOf: ['#1 Best Steakhouse','#3 Best Date Night'] },
    { name: "Hodad's — Ocean Beach",                 bestOf: ['#1 Best Burger'] },
    { name: 'Puesto La Jolla',                       bestOf: ['#1 Best Tacos'] },
    { name: 'Las Cuatro Milpas',                     bestOf: ['#1 Best Mexican','#1 Best Local Fave'] },
    { name: "Carnitas' Snack Shack — North Park",    bestOf: ['#1 Best Sandwiches','#1 Best Casual'] },
    { name: "Phil's BBQ",                            bestOf: ['#1 Best BBQ'] },
    { name: "Buona Forchetta",                       bestOf: ['#1 Best Pizza','#1 Best Italian'] },
  ],

  SF_DATA: [
    // Fine Dining tier
    { name: 'Atelier Crenn',          bestOf: ['#1 Best Fine Dining','#1 Best Overall','#1 Best Tasting Menu'] },
    { name: 'Quince',                 bestOf: ['#2 Best Fine Dining','#1 Best Italian Fine Dining','#2 Best Tasting Menu'] },
    { name: 'Benu',                   bestOf: ['#3 Best Fine Dining','#3 Best Tasting Menu','#1 Best Date Night'] },
    { name: 'Saison',                 bestOf: ['#4 Best Fine Dining','#4 Best Tasting Menu'] },
    { name: 'Lazy Bear',              bestOf: ['#5 Best Fine Dining','#1 Best Modern American'] },
    { name: 'Acquerello',             bestOf: ['#2 Best Italian Fine Dining','#2 Best Date Night'] },
    { name: 'Birdsong',               bestOf: ['#5 Best Tasting Menu'] },
    { name: 'Sons & Daughters',       bestOf: ['#3 Best Date Night'] },
    { name: 'Gary Danko',             bestOf: ['#4 Best Date Night','#1 Best Celebrations'] },
    // Italian / Pasta
    { name: 'Cotogna',                bestOf: ['#1 Best Italian (Casual)','#1 Best Pasta'] },
    { name: 'Flour + Water',          bestOf: ['#2 Best Pasta','#3 Best Italian'] },
    { name: 'Che Fico',               bestOf: ['#1 Best Cal-Italian','#5 Best Date Night'] },
    { name: 'Sorrel',                 bestOf: ['#3 Best Italian Fine Dining'] },
    // Iconic SF / James Beard classics
    { name: 'Zuni Café',              bestOf: ['#1 Best Iconic SF','#1 Best Roast Chicken','#1 Best Brunch'] },
    { name: 'Swan Oyster Depot',      bestOf: ['#1 Best Oysters','#1 Best SF Classic','#1 Best Walk-In'] },
    { name: 'Tadich Grill',           bestOf: ['#2 Best SF Classic','#1 Best Cioppino'] },
    { name: 'House of Prime Rib',     bestOf: ['#1 Best Steakhouse','#1 Best Prime Rib','#3 Best SF Classic'] },
    { name: 'Tartine Bakery',         bestOf: ['#1 Best Bakery','#1 Best Pastry'] },
    { name: 'Tartine Manufactory',    bestOf: ['#2 Best Bakery'] },
    { name: 'Sotto Mare',             bestOf: ['#2 Best Cioppino','#1 Best North Beach'] },
    // Asian / Modern
    { name: "Mister Jiu's",           bestOf: ['#1 Best Chinese','#1 Best Chinatown','#1 Best Cantonese'] },
    { name: 'Kin Khao',               bestOf: ['#1 Best Thai'] },
    { name: 'Niku Steakhouse',        bestOf: ['#1 Best Japanese Steakhouse','#2 Best Steakhouse'] },
    { name: 'Rintaro',                bestOf: ['#1 Best Izakaya','#1 Best Japanese (Casual)'] },
    { name: 'Noodle in a Haystack',   bestOf: ['#1 Best Ramen'] },
    // Cocktails
    { name: 'Trick Dog',              bestOf: ['#1 Best Cocktails','#1 Best Mission Bar'] },
    { name: "Smuggler's Cove",        bestOf: ['#1 Best Tiki Bar','#1 Best Hayes Valley Bar'] },
    { name: 'Bourbon & Branch',       bestOf: ['#1 Best Speakeasy'] },
    { name: 'Pacific Cocktail Haven', bestOf: ['#2 Best Cocktails'] },
    { name: 'ABV',                    bestOf: ['#3 Best Cocktails'] },
    // Other
    { name: 'Foreign Cinema',         bestOf: ['#2 Best Brunch','#1 Best Mission Brunch'] },
    { name: 'Nopalito',               bestOf: ['#1 Best Mexican'] },
    { name: 'La Mar Cebicheria',      bestOf: ['#1 Best Peruvian','#1 Best Embarcadero'] },
    { name: 'Kokkari Estiatorio',     bestOf: ['#1 Best Greek'] },
    { name: 'A16',                    bestOf: ['#1 Best Pizza','#4 Best Italian'] },
    { name: 'Nopa',                   bestOf: ['#1 Best Late Night','#1 Best NoPa'] },
    { name: 'Rich Table',             bestOf: ['#2 Best Modern American','#1 Best Hayes Valley'] },
    { name: 'State Bird Provisions',  bestOf: ['#3 Best Modern American'] },
  ],

  CHARLOTTE_DATA: [
    // Fine Dining
    { name: 'Counter-',                       bestOf: ['#1 Best Fine Dining','#1 Best Tasting Menu','#1 Best Overall'] },
    { name: 'Kindred',                        bestOf: ['#2 Best Fine Dining','#1 Best Davidson','#1 Best Date Night'] },
    { name: 'Leah & Louise',                  bestOf: ['#1 Best Modern Southern','#1 Best Camp North End','#3 Best Fine Dining'] },
    { name: "Barrington's Restaurant",        bestOf: ['#3 Best Date Night','#4 Best Fine Dining'] },
    { name: 'Stanley',                        bestOf: ['#5 Best Fine Dining','#1 Best Elizabeth'] },
    { name: 'Restaurant Constance',           bestOf: ['#2 Best Tasting Menu','#1 Best Wesley Heights'] },
    { name: 'Bardo',                          bestOf: ['#3 Best Tasting Menu','#1 Best NoDa New American'] },
    { name: 'Haymaker',                       bestOf: ['#1 Best Uptown Fine Dining'] },
    { name: 'Heirloom Restaurant',            bestOf: ['#1 Best Farm-to-Table'] },
    // BBQ
    { name: "Jon G's Barbecue",               bestOf: ['#1 Best BBQ','#1 Best Brisket','#1 Best Day Trip'] },
    { name: "Sweet Lew's BBQ",                bestOf: ['#2 Best BBQ'] },
    { name: 'Noble Smoke',                    bestOf: ['#3 Best BBQ'] },
    { name: 'Midwood Smokehouse',             bestOf: ['#4 Best BBQ','#1 Best Plaza Midwood BBQ'] },
    // Brunch / Southern
    { name: 'Supperland',                     bestOf: ['#1 Best Brunch','#1 Best Southern','#2 Best Date Night'] },
    { name: 'The Goodyear House',             bestOf: ['#2 Best Brunch','#1 Best NoDa Brunch'] },
    { name: 'Haberdish',                      bestOf: ['#3 Best Brunch','#2 Best Southern'] },
    // Cocktails
    { name: 'Idlewild',                       bestOf: ['#1 Best Cocktails','#1 Best NoDa Cocktail Bar'] },
    { name: 'The Crunkleton',                 bestOf: ['#1 Best Speakeasy'] },
    { name: 'Lorem Ipsum',                    bestOf: ['#1 Best Listening Bar','#2 Best Cocktails'] },
    { name: 'Humbug',                         bestOf: ['#3 Best Cocktails'] },
    { name: 'The Cellar at Duckworth\'s',     bestOf: ['#2 Best Speakeasy'] },
    // Burger / Sandwich
    { name: "Brooks' Sandwich House",         bestOf: ['#1 Best Burger','#1 Best Sandwich','#1 Best Local Fave'] },
    // Steakhouse
    { name: 'Steak 48',                       bestOf: ['#1 Best Steakhouse'] },
    { name: "Dressler's Restaurant — Metropolitan", bestOf: ['#2 Best Steakhouse'] },
    { name: 'Oak Steakhouse',                 bestOf: ['#3 Best Steakhouse','#2 Best Uptown Fine Dining'] },
    // Italian / Pasta
    { name: 'Stagioni',                       bestOf: ['#1 Best Italian','#1 Best Myers Park'] },
    { name: 'Spaghett',                       bestOf: ['#2 Best Italian'] },
    { name: 'Eso Artisanal Pasta',            bestOf: ['#1 Best Pasta','#1 Best Optimist Hall'] },
    { name: 'Ever Andalo',                    bestOf: ['#3 Best Italian','#2 Best NoDa'] },
    // Sushi / Japanese / Nikkei
    { name: 'Omakase Experience by Primefish',bestOf: ['#1 Best Omakase','#1 Best Japanese'] },
    { name: 'Sora',                           bestOf: ['#2 Best Omakase','#2 Best Japanese'] },
    { name: 'Yunta',                          bestOf: ['#1 Best Nikkei','#1 Best Peruvian'] },
    { name: 'Muraya',                         bestOf: ['#3 Best Sushi','#1 Best South End Sushi'] },
    { name: 'Primefish Cellar',               bestOf: ['#2 Best Sushi','#1 Best Cotswold'] },
    // Mexican / Latin
    { name: 'The Story of Mi Cariño',         bestOf: ['#1 Best Mexican'] },
    { name: 'Maiz Agua Sal',                  bestOf: ['#2 Best Mexican','#1 Best West Charlotte'] },
    { name: 'Noche Bruta',                    bestOf: ['#3 Best Mexican'] },
    // Vietnamese / Asian
    { name: 'Lang Van',                       bestOf: ['#1 Best Vietnamese','#1 Best Charlotte Institution','#2 Best Local Fave'] },
    // Seafood
    { name: 'Hello, Sailor',                  bestOf: ['#1 Best Lake Norman','#1 Best Seafood','#1 Best Waterfront'] },
    { name: 'Seaboy',                         bestOf: ['#2 Best Seafood','#2 Best Lake Norman'] },
    // Pizza / French
    { name: 'Bird Pizzeria',                  bestOf: ['#1 Best Pizza'] },
    { name: 'La Belle Helene',                bestOf: ['#1 Best French','#3 Best Brunch'] },
    { name: 'Fig Tree Restaurant',            bestOf: ['#1 Best Wine List','#4 Best Fine Dining'] },
    { name: 'Bonterra Dining & Wine Room',    bestOf: ['#2 Best Wine List'] },
  ],

  NYC_DATA: [
    // Fine Dining / Tasting Menu
    { name: 'Le Bernardin',                  bestOf: ['#1 Best Fine Dining','#1 Best French','#1 Best Seafood'] },
    { name: 'Eleven Madison Park',           bestOf: ['#1 Best Tasting Menu','#2 Best Fine Dining'] },
    { name: 'Per Se',                        bestOf: ['#2 Best Tasting Menu','#3 Best Fine Dining'] },
    { name: "Chef's Table at Brooklyn Fare", bestOf: ['#3 Best Tasting Menu','#1 Best Brooklyn Fine Dining'] },
    { name: 'Atera',                         bestOf: ['#4 Best Tasting Menu'] },
    { name: 'Saga',                          bestOf: ['#1 Best FiDi Fine Dining','#5 Best Tasting Menu'] },
    { name: 'Aska',                          bestOf: ['#1 Best Scandinavian','#1 Best Williamsburg Fine Dining'] },
    { name: 'Gabriel Kreuther',              bestOf: ['#1 Best Alsatian','#4 Best Fine Dining'] },
    // Steakhouse
    { name: 'Peter Luger Steak House',       bestOf: ['#1 Best Steakhouse','#1 Best Iconic NY'] },
    { name: '4 Charles Prime Rib',           bestOf: ['#2 Best Steakhouse','#1 Best Prime Rib'] },
    { name: 'Gage & Tollner',                bestOf: ['#1 Best Brooklyn Steakhouse','#1 Best Restored Classic'] },
    // Italian
    { name: 'Carbone',                       bestOf: ['#1 Best Italian-American','#1 Best Celebration'] },
    { name: 'Via Carota',                    bestOf: ['#1 Best West Village','#1 Best Italian Trattoria'] },
    { name: 'Lilia',                         bestOf: ['#1 Best Pasta','#1 Best Williamsburg Italian'] },
    { name: 'Don Angie',                     bestOf: ['#2 Best Italian-American','#1 Best Date Night'] },
    { name: 'I Sodi',                        bestOf: ['#1 Best Tuscan','#2 Best West Village'] },
    // Sushi / Japanese
    { name: 'Sushi Nakazawa',                bestOf: ['#1 Best Sushi (Accessible)','#3 Best Omakase'] },
    { name: 'Sushi Sho',                     bestOf: ['#1 Best Omakase','#1 Best Sushi'] },
    { name: 'Sushi Noz',                     bestOf: ['#2 Best Omakase','#2 Best Sushi'] },
    // Korean
    { name: 'Atomix',                        bestOf: ['#1 Best Korean','#1 Best Modern Korean Tasting'] },
    { name: 'Jungsik',                       bestOf: ['#2 Best Korean','#5 Best Fine Dining'] },
    // French
    { name: 'Le Coucou',                     bestOf: ['#2 Best French','#1 Best French Bistro'] },
    { name: 'Balthazar',                     bestOf: ['#1 Best French Brasserie','#1 Best SoHo Brunch'] },
    // Mexican / Latin
    { name: 'Cosme',                         bestOf: ['#1 Best Mexican Fine Dining','#1 Best Modern Mexican'] },
    { name: 'Tatiana by Kwame Onwuachi',     bestOf: ['#1 Best Afro-Caribbean','#1 Best Lincoln Center'] },
    // New American
    { name: 'Gramercy Tavern',               bestOf: ['#1 Best New American','#1 Best Hospitality'] },
    { name: 'Crown Shy',                     bestOf: ['#1 Best Financial District'] },
    { name: 'Olmsted',                       bestOf: ['#1 Best Brooklyn New American'] },
    // Indian / South Asian
    { name: 'Dhamaka',                       bestOf: ['#1 Best Indian','#1 Best Lower East Side'] },
    // Iconic / Classics
    { name: 'Russ & Daughters',              bestOf: ['#1 Best Jewish Appetizing','#1 Best Bagel Spread'] },
  ],

  HOUSTON_DATA: [
    // Fine Dining / Tasting Menu
    { name: 'Tatemó',                        bestOf: ['#1 Best Fine Dining','#1 Best Mexican Tasting Menu','#1 Best Overall'] },
    { name: 'March',                         bestOf: ['#2 Best Fine Dining','#1 Best Mediterranean','#1 Best Tasting Menu'] },
    { name: 'Le Jardinier',                  bestOf: ['#3 Best Fine Dining','#1 Best French'] },
    { name: 'BCN Taste & Tradition',         bestOf: ['#1 Best Spanish','#4 Best Fine Dining'] },
    // BBQ
    { name: 'CorkScrew BBQ',                 bestOf: ['#1 Best BBQ','#1 Best Brisket'] },
    { name: 'Truth BBQ',                     bestOf: ['#2 Best BBQ'] },
    { name: "Killen's BBQ",                  bestOf: ['#3 Best BBQ'] },
    { name: 'Blood Bros. BBQ',               bestOf: ['#4 Best BBQ','#1 Best BBQ Fusion'] },
    { name: "Pinkerton's Barbecue",          bestOf: ['#5 Best BBQ'] },
    // Mexican
    { name: "Hugo's",                        bestOf: ['#1 Best Mexican','#1 Best Regional Mexican'] },
    { name: 'Xochi',                         bestOf: ['#2 Best Mexican','#1 Best Oaxacan'] },
    { name: 'Caracol',                       bestOf: ['#1 Best Mexican Seafood','#3 Best Mexican'] },
    // Japanese / Sushi
    { name: 'Uchi Houston',                  bestOf: ['#1 Best Japanese','#1 Best Sushi'] },
    { name: 'Katami',                        bestOf: ['#2 Best Japanese','#1 Best Omakase'] },
    // New American
    { name: "Nancy's Hustle",                bestOf: ['#1 Best New American','#1 Best East End'] },
    { name: 'Theodore Rex',                  bestOf: ['#2 Best New American','#1 Best Date Night'] },
    // Indian / Thai / Vietnamese / Chinese
    { name: 'Musaafer',                      bestOf: ['#1 Best Indian','#1 Best Indian Fine Dining'] },
    { name: 'Street to Kitchen',             bestOf: ['#1 Best Thai'] },
    { name: 'Crawfish & Noodles',            bestOf: ['#1 Best Vietnamese','#1 Best Cajun Fusion'] },
    { name: 'Mala Sichuan Bistro',           bestOf: ['#1 Best Sichuan','#1 Best Chinese'] },
    // Steakhouse
    { name: 'Pappas Bros. Steakhouse',       bestOf: ['#1 Best Steakhouse','#1 Best Wine List'] },
    { name: "Killen's Steakhouse",           bestOf: ['#2 Best Steakhouse'] },
    { name: 'Georgia James',                 bestOf: ['#3 Best Steakhouse','#1 Best Modern Steakhouse'] },
  ],

  MIAMI_DATA: [
    // Iconic / Stone Crab
    { name: "Joe's Stone Crab",              bestOf: ['#1 Best Iconic Miami','#1 Best Stone Crab','#1 Best South Beach Classic'] },
    // Fine Dining / Omakase
    { name: 'Naoe',                          bestOf: ['#1 Best Omakase','#1 Best Fine Dining','#1 Best Tasting Menu'] },
    { name: 'Stubborn Seed',                 bestOf: ['#2 Best Fine Dining','#1 Best South Beach Tasting'] },
    { name: 'The Surf Club Restaurant',      bestOf: ['#1 Best Hotel Restaurant','#1 Best Surfside','#3 Best Fine Dining'] },
    { name: "L'Atelier de Joël Robuchon",    bestOf: ['#1 Best French','#4 Best Fine Dining'] },
    { name: 'Le Jardinier Miami',            bestOf: ['#2 Best French','#1 Best Vegetable-Forward'] },
    { name: 'Shingo',                        bestOf: ['#2 Best Omakase'] },
    { name: 'Hiden',                         bestOf: ['#3 Best Omakase'] },
    { name: 'Ogawa',                         bestOf: ['#4 Best Omakase'] },
    { name: 'The Den at Azabu Miami Beach',  bestOf: ['#5 Best Omakase'] },
    // Steakhouse
    { name: 'Cote Miami',                    bestOf: ['#1 Best Steakhouse','#1 Best Korean Steakhouse'] },
    // Italian
    { name: 'Boia De',                       bestOf: ['#1 Best Italian','#1 Best Buena Vista','#1 Best Date Night'] },
    { name: 'Le Sirenuse Miami',             bestOf: ['#2 Best Italian','#1 Best Amalfi'] },
    { name: 'Lucali Miami Beach',            bestOf: ['#1 Best Pizza'] },
    // Cuban
    { name: 'Cafe La Trova',                 bestOf: ['#1 Best Cuban','#1 Best Bar Program'] },
    { name: 'Versailles Restaurant',         bestOf: ['#2 Best Cuban','#1 Best Little Havana','#1 Best Cuban Institution'] },
    { name: 'Ariete',                        bestOf: ['#1 Best Cuban-American','#1 Best Coconut Grove'] },
    // Greek / Seafood
    { name: 'Estiatorio Milos',              bestOf: ['#1 Best Greek','#1 Best Seafood (Modern)'] },
    // Asian Fusion
    { name: 'KYU',                           bestOf: ['#1 Best Asian Fusion','#1 Best Wynwood'] },
    // Cocktail Bars
    { name: 'The Broken Shaker',             bestOf: ['#2 Best Bar Program','#1 Best Hotel Bar'] },
    { name: "Sweet Liberty Drinks & Supply Co.", bestOf: ['#3 Best Bar Program'] },
    { name: "Dante's HiFi",                  bestOf: ['#1 Best Listening Bar'] },
    { name: 'Viceversa',                     bestOf: ['#1 Best Italian Bar','#4 Best Bar Program'] },
  ],

  SANANTONIO_DATA: [
    // Fine Dining / Mexican
    { name: 'Mixtli',                        bestOf: ['#1 Best Overall','#1 Best Fine Dining','#1 Best Mexican','#1 Best Tasting Menu'] },
    { name: 'Botika',                        bestOf: ['#1 Best Peruvian','#1 Best Fusion'] },
    { name: 'Clementine',                    bestOf: ['#1 Best New American','#1 Best Date Night'] },
    { name: 'Bliss',                         bestOf: ['#2 Best New American','#2 Best Date Night'] },
    { name: 'Folc',                          bestOf: ['#2 Best Fine Dining','#1 Best Tower of the Americas Skyline'] },
    { name: 'Supper at Hotel Emma',          bestOf: ['#1 Best Hotel Restaurant','#1 Best Pearl District'] },
    { name: 'Meadow Neighborhood Eatery + Bar', bestOf: ['#1 Best Neighborhood'] },
    // BBQ
    { name: '2M Smokehouse',                 bestOf: ['#1 Best BBQ','#1 Best Texas Monthly Pick'] },
    { name: 'Curry Boys BBQ',                bestOf: ['#2 Best BBQ','#1 Best Indian-Texas BBQ'] },
    // Italian / Pizza
    { name: 'Battalion',                     bestOf: ['#1 Best Italian'] },
    { name: 'Dough Pizzeria Napoletana',     bestOf: ['#1 Best Pizza','#1 Best Neapolitan'] },
    // Asian
    { name: 'Best Quality Daughter',         bestOf: ['#1 Best Asian-American'] },
    // Tex-Mex / Mexican Classics
    { name: 'Mi Tierra Cafe & Bakery',       bestOf: ['#1 Best Tex-Mex Institution','#1 Best Market Square'] },
    { name: 'La Gloria',                     bestOf: ['#1 Best Mexican Street Food'] },
    { name: 'Carnitas Lonja',                bestOf: ['#1 Best Tacos','#1 Best Carnitas'] },
    // Bakery / Cafe
    { name: 'Bakery Lorraine',               bestOf: ['#1 Best Bakery','#1 Best Cafe'] },
    { name: 'La Panaderia',                  bestOf: ['#1 Best Mexican Bakery'] },
    // Cocktail / Gastropub
    { name: 'The Esquire Tavern',            bestOf: ['#1 Best Cocktail Bar','#1 Best Riverwalk Bar'] },
    { name: 'Biga on the Banks',             bestOf: ['#1 Best Riverwalk Restaurant'] },
    // Seafood / Cajun
    { name: 'Pinch Boil House',              bestOf: ['#1 Best Cajun'] },
    // Brewery
    { name: 'Southerleigh Fine Food & Brewery', bestOf: ['#1 Best Brewery'] },
  ],
};

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
let totalUpdated = 0;

for (const [cityKey, entries] of Object.entries(BESTOF)) {
  let updated = 0;
  const cityStart = html.indexOf('const ' + cityKey);
  if (cityStart < 0) { console.error('City not found: ' + cityKey); continue; }
  const arrStart = html.indexOf('[', cityStart);
  let depth = 0, arrEnd = arrStart;
  for (let i = arrStart; i < html.length; i++) {
    if (html[i] === '[') depth++;
    if (html[i] === ']') { depth--; if (depth === 0) { arrEnd = i + 1; break; } }
  }

  for (const { name, bestOf } of entries) {
    const citySlice = html.slice(arrStart, arrEnd);
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const namePattern = new RegExp('"name":"' + escapedName + '"');
    const nameMatch = namePattern.exec(citySlice);
    if (!nameMatch) {
      console.warn(`  ⚠️  ${cityKey}: "${name}" not found`);
      continue;
    }

    const entryStart = arrStart + nameMatch.index;
    let braceStart = entryStart;
    while (braceStart > arrStart && html[braceStart] !== '{') braceStart--;
    let bd = 0, braceEnd = braceStart;
    for (let i = braceStart; i < arrEnd; i++) {
      if (html[i] === '{') bd++;
      if (html[i] === '}') { bd--; if (bd === 0) { braceEnd = i; break; } }
    }

    const entrySlice = html.slice(braceStart, braceEnd + 1);
    const bestOfStr = JSON.stringify(bestOf);
    const newSlice = entrySlice.replace(/"bestOf":\[[^\]]*\]/, '"bestOf":' + bestOfStr);

    if (newSlice === entrySlice) {
      console.warn(`  ⚠️  ${cityKey}: "${name}" bestOf field not found or unchanged`);
      continue;
    }

    html = html.slice(0, braceStart) + newSlice + html.slice(braceEnd + 1);
    // Recompute arrEnd after modification
    const lenDiff = newSlice.length - entrySlice.length;
    arrEnd += lenDiff;
    updated++;
    totalUpdated++;
    console.log(`  ✅ ${cityKey}: "${name}" → ${bestOfStr}`);
  }
  console.log(`${cityKey}: ${updated}/${entries.length} updated\n`);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log(`Total: ${totalUpdated} entries updated.`);
