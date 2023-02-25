"use strict";

const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const { MODE } = require(path.join(basePath, "src/blendMode.js"));

const layersDir = path.join(basePath, "../step1_layers_to_spritesheet/output"); // Input is read from previous step
const outputDir = path.join(basePath, "/output"); // Images are written to output folder
const buildDir = path.join(basePath, "../build"); // JSON are written to json folder

/*********************
 * General Generator Options
 ***********************/

const {
  numFramesPerBatch,
  numberOfFrames,
  useBatches,
  description,
  baseUri,
  height,
  width,
  startIndex,
  thumbnailUri,
  generateThumbnail,
  debug,
  totalSupply,
  layersFolder,
  outputType,
  animationUri
} = require(path.join(
  basePath,
  "../global_config.json"
));

/* ONLY VARIABLE THAT YOU NEED TO EDIT IS HERE */
let layerConfigurations = [
  {
    growEditionSizeTo: totalSupply*0.7/2,
    namePrefix: "Female Common", // Use to add a name to Metadata `name:`
    layersOrder: [
      { name: "Background" },
      { name: "QioraBackground" },
      { name: "FemaleCommonBody" },
      { name: "FemaleCommonHead" },
      { name: "EyesCommon" },
      { name: "FemaleCommonHairBackground" },
      { name: "FemaleCommonArmor" },
      { name: "FemaleCommonHairForeground" },
      { name: "Headgear" },
      { name: "QioraForeground" },
    ],
  },
  {
    growEditionSizeTo: totalSupply*0.9/2,
    namePrefix: "Female Uncommon", // Use to add a name to Metadata `name:`
    layersOrder: [
      { name: "Background" },
      { name: "QioraBackground" },
      { name: "FemaleBack" },
      { name: "FemaleCommonBody" },
      { name: "FemaleCommonHead" },
      { name: "EyesCommon" },
      { name: "FemaleUncommonHairBackground" },
      { name: "FemaleUncommonArmor" },
      { name: "FemaleCommonHairForeground" },
      { name: "Headgear" },
      { name: "QioraForeground" },
    ],
  },
  {
    growEditionSizeTo: totalSupply*1/2,
    namePrefix: "Female Rare", // Use to add a name to Metadata `name:`
    layersOrder: [
      { name: "Background" },
      { name: "QioraBackground" },
      { name: "FemaleBack" },
      { name: "FemaleRareBody" },
      { name: "FemaleRareHead" },
      { name: "EyesRare" },
      { name: "FemaleRareHairBackground" },
      { name: "FemaleRareArmor" },
      { name: "FemaleRareHairForeground" },
      { name: "Headgear" },
      { name: "QioraForeground" },
    ],
  },
  {
    growEditionSizeTo: totalSupply/2 + totalSupply/2*0.7,
    namePrefix: "Male Common", // Use to add a name to Metadata `name:`
    layersOrder: [
      { name: "Background" },
      { name: "QioraBackground" },
      { name: "MaleCommonBody" },
      { name: "MaleCommonHead" },
      { name: "EyesCommon" },
      { name: "MaleCommonHair" },
      { name: "MaleCommonArmor" },
      { name: "Headgear" },
      { name: "QioraForeground" },
    ],
  },
  {
    growEditionSizeTo: totalSupply/2 + totalSupply/2*0.9,
    namePrefix: "Male Uncommon", // Use to add a name to Metadata `name:`
    layersOrder: [
      { name: "Background" },
      { name: "QioraBackground" },
      { name: "MaleBack" },
      { name: "MaleCommonBody" },
      { name: "MaleCommonHead" },
      { name: "EyesCommon" },
      { name: "MaleCommonHair" },
      { name: "MaleUncommonArmor" },
      { name: "Headgear" },
      { name: "QioraForeground" },
    ],
  },
  {
    growEditionSizeTo: totalSupply/2 + totalSupply/2*1,
    namePrefix: "Male Rare", // Use to add a name to Metadata `name:`
    layersOrder: [
      { name: "Background" },
      { name: "QioraBackground" },
      { name: "MaleBack" },
      { name: "MaleRareBody" },
      { name: "MaleRareHead" },
      { name: "EyesRare" },
      { name: "MaleRareHair" },
      { name: "MaleRareArmor" },
      { name: "Headgear" },
      { name: "QioraForeground" },
    ],
  },
]

const format = {
  width: useBatches ? (width * numFramesPerBatch) : (width * numberOfFrames),
  height,
  smoothing: true, // set to false when up-scaling pixel art.
};

const background = {
  generate: false,
  brightness: "80%",
};


const layerConfigurationsZIndex = [
  {
    growEditionSizeTo: totalSupply,
    namePrefix: "Bouncing Ball Z-Index Example:",
    layersOrder: [
      { name: "Background" },
      { name: "Landscape" },
      { name: "Ball" },
    ],
  },
]

// This will create totalSupply - 1 common balls, and 1 rare ball
// They will be in order but you can shuffleLayerConfigurations
const layerConfigurationsGrouping = [
  {
    growEditionSizeTo: totalSupply - 1,
    namePrefix: "Bouncing Ball Common:",
    layersOrder: [
      { name: "Background" },
      { name: "Landscape" },
      { name: "Common Ball", trait: "Ball" },
      { name: "Common Hat", trait: "Hat" },
    ],
  },
  {
    growEditionSizeTo: totalSupply,
    namePrefix: "Bouncing Ball Rare:",
    layersOrder: [
      { name: "Background" },
      { name: "Landscape" },
      { name: "Rare Ball", trait: "Ball" },
      { name: "Rare Hat", trait: "Hat" },
    ],
  },
]

const layerConfigurationsIfThen = [
  {
    growEditionSizeTo: totalSupply,
    namePrefix: "", // Use to add a name to Metadata `name:`
    layersOrder: [
      { name: "Background" },
      { name: "Landscape" },
      {
        name: "Ball",
      },
    ],
  },
]

const handler = {
  get: function (target, name) {
    return target.hasOwnProperty(name) ? target[name] : layerConfigurations;
  }
};

const layerConfigurationMapping = new Proxy({
  "layers": layerConfigurations,
  "layers_z_index": layerConfigurationsZIndex,
  "layers_grouping": layerConfigurationsGrouping,
  "layers_if_then": layerConfigurationsIfThen,
}, handler);

layerConfigurations = layerConfigurationMapping[layersFolder];

/**
 * Set to true for when using multiple layersOrder configuration
 * and you would like to shuffle all the artwork together
 */
const shuffleLayerConfigurations = true;

const debugLogs = debug;

/*********************
 * Advanced Generator Options
 ***********************/

// if you use an empty/transparent file, set the name here.
const emptyLayerName = "NONE";

/**
 * Incompatible items can be added to this object by a files cleanName
 * This works in layer order, meaning, you need to define the layer that comes
 * first as the Key, and the incompatible items that _may_ come after.
 * The current version requires all layers to have unique names, or you may
 * accidentally set incompatibilities for the _wrong_ item.
 *
 * Try run it with layers_incompatible and see that the Flashing background
 * will not have the flashing ball
 */
const incompatible = {
  // Flashing: ["Multicolor"],
  NONE: ["Plante", "Vent"],

  // Females
  FemaleCommonBody1: ["FemaleCommonHead12", "FemaleCommonHead13", "FemaleCommonHead14", "FemaleCommonHead15",
                      "FemaleCommonHead22", "FemaleCommonHead23", "FemaleCommonHead24", "FemaleCommonHead25", "Headgear10"],
  FemaleCommonBody2: ["FemaleCommonHead11", "FemaleCommonHead13", "FemaleCommonHead14", "FemaleCommonHead15",
                      "FemaleCommonHead21", "FemaleCommonHead23", "FemaleCommonHead24", "FemaleCommonHead25", "Headgear10"],
  FemaleCommonBody3: ["FemaleCommonHead11", "FemaleCommonHead12", "FemaleCommonHead14", "FemaleCommonHead15",
                      "FemaleCommonHead21", "FemaleCommonHead22", "FemaleCommonHead24", "FemaleCommonHead25", "Headgear10"],
  FemaleCommonBody4: ["FemaleCommonHead11", "FemaleCommonHead12", "FemaleCommonHead13", "FemaleCommonHead15",
                      "FemaleCommonHead21", "FemaleCommonHead22", "FemaleCommonHead23", "FemaleCommonHead25", "Headgear10"],
  FemaleCommonBody5: ["FemaleCommonHead11", "FemaleCommonHead12", "FemaleCommonHead13", "FemaleCommonHead14",
                      "FemaleCommonHead21", "FemaleCommonHead22", "FemaleCommonHead23", "FemaleCommonHead24", "Headgear10"],

  FemaleRareBody1: ["FemaleRareHead12", "FemaleRareHead22", "Headgear10"],
  FemaleRareBody2: ["FemaleRareHead11", "FemaleRareHead21", "Headgear10"],


  // Females hair/armor superpositions
  //Common
  // Background
  FemaleCommonHairBackground1: ["FemaleCommonArmor20", "FemaleCommonArmor21", "FemaleCommonArmor22", "FemaleCommonArmor23",
                        "FemaleCommonArmor30", "FemaleCommonArmor31", "FemaleCommonArmor32", "FemaleCommonArmor33",
                         "FemaleUncommonArmor10", "FemaleUncommonArmor11", "FemaleUncommonArmor12", 
                         "FemaleUncommonArmor20", "FemaleUncommonArmor21", "FemaleUncommonArmor22", 
                        "Headgear11", "Headgear10", "Headgear3", "Headgear5", "Headgear8"],

  FemaleCommonHairBackground2: ["FemaleCommonArmor20", "FemaleCommonArmor21", "FemaleCommonArmor22", "FemaleCommonArmor23",
                         "FemaleCommonArmor30", "FemaleCommonArmor31", "FemaleCommonArmor32", "FemaleCommonArmor33",
                         "FemaleUncommonArmor10", "FemaleUncommonArmor11", "FemaleUncommonArmor12", 
                         "FemaleUncommonArmor20", "FemaleUncommonArmor21", "FemaleUncommonArmor22", 
                         "Headgear11", "Headgear10", "Headgear3", "Headgear5", "Headgear8"],

  FemaleCommonHairBackground3: ["Headgear11", "Headgear10"],
  FemaleCommonHairBackground4: ["Headgear11", "Headgear3", "Headgear10", "Headgear5", "Headgear8"],

  FemaleCommonHairBackground5: ["FemaleCommonArmor30", "FemaleCommonArmor31", "FemaleCommonArmor32", "FemaleCommonArmor33",
                         "FemaleUncommonArmor10", "FemaleUncommonArmor11", "FemaleUncommonArmor12", 
                         "FemaleUncommonArmor20", "FemaleUncommonArmor21", "FemaleUncommonArmor22",
                         "Headgear11", "Headgear10", "Headgear8"],
                         
  /*FemaleCommonHairBackground6: ["FemaleCommonArmor20", "FemaleCommonArmor21", "FemaleCommonArmor22", "FemaleCommonArmor23",
                         "FemaleCommonArmor30", "FemaleCommonArmor31", "FemaleCommonArmor32", "FemaleCommonArmor33",
                         "FemaleUncommonArmor10", "FemaleUncommonArmor11", "FemaleUncommonArmor12", 
                         "FemaleUncommonArmor20", "FemaleUncommonArmor21", "FemaleUncommonArmor22", 
                         "Headgear11", "Headgear3", "Headgear10"], */
                         
  FemaleCommonHairBackgroundNone: ["FemaleCommonHairForegroundNone", 
                        "FemaleCommonArmor10", "FemaleCommonArmor11", "FemaleCommonArmor12", "FemaleCommonArmor13", 
                        "Headgear10"],


  //Uncommon
  FemaleUncommonHairBackground3: ["Headgear11", "Headgear10"],
  FemaleUncommonHairBackground4: ["Headgear11", "Headgear3", "Headgear10", "Headgear5", "Headgear8"],
  FemaleUncommonHairBackgroundNone: ["FemaleCommonHairForegroundNone", 
                        "FemaleCommonArmor10", "FemaleCommonArmor11", "FemaleCommonArmor12", "FemaleCommonArmor13", 
                        "Headgear10"],

  // Foreground
  FemaleCommonArmor10: ["FemaleCommonHairForeground1", "FemaleCommonHairForeground2","FemaleCommonHairForeground3",
                        "FemaleCommonHairForeground4","FemaleCommonHairForeground5","FemaleCommonHairForeground6",],
  FemaleCommonArmor11: ["FemaleCommonHairForeground1", "FemaleCommonHairForeground2","FemaleCommonHairForeground3",
                        "FemaleCommonHairForeground4","FemaleCommonHairForeground5","FemaleCommonHairForeground6",],
  FemaleCommonArmor12: ["FemaleCommonHairForeground1", "FemaleCommonHairForeground2","FemaleCommonHairForeground3",
                        "FemaleCommonHairForeground4","FemaleCommonHairForeground5","FemaleCommonHairForeground6",],
  FemaleCommonArmor13: ["FemaleCommonHairForeground1", "FemaleCommonHairForeground2","FemaleCommonHairForeground3",
                        "FemaleCommonHairForeground4","FemaleCommonHairForeground5","FemaleCommonHairForeground6",],

  FemaleCommonArmor20: ["FemaleCommonHairForeground1", "FemaleCommonHairForeground3", "FemaleCommonHairForeground4", 
                        "FemaleCommonHairForeground5", "FemaleCommonHairForeground6"],
  FemaleCommonArmor21: ["FemaleCommonHairForeground1", "FemaleCommonHairForeground3", "FemaleCommonHairForeground4",
                        "FemaleCommonHairForeground5", "FemaleCommonHairForeground6"],
  FemaleCommonArmor22: ["FemaleCommonHairForeground1", "FemaleCommonHairForeground3", "FemaleCommonHairForeground4",
                        "FemaleCommonHairForeground5", "FemaleCommonHairForeground6"],
  FemaleCommonArmor23: ["FemaleCommonHairForeground1", "FemaleCommonHairForeground3", "FemaleCommonHairForeground4",
                        "FemaleCommonHairForeground5", "FemaleCommonHairForeground6"],

  FemaleCommonArmor30: ["FemaleCommonHairForeground3", "FemaleCommonHairForeground4"],
  FemaleCommonArmor31: ["FemaleCommonHairForeground3", "FemaleCommonHairForeground4"],
  FemaleCommonArmor32: ["FemaleCommonHairForeground3", "FemaleCommonHairForeground4"],
  FemaleCommonArmor33: ["FemaleCommonHairForeground3", "FemaleCommonHairForeground4"],

  FemaleUncommonArmor10: ["FemaleCommonHairForeground3", "FemaleCommonHairForeground4", "FemaleCommonHairForeground6"],
  FemaleUncommonArmor11: ["FemaleCommonHairForeground3", "FemaleCommonHairForeground4", "FemaleCommonHairForeground6"],
  FemaleUncommonArmor12: ["FemaleCommonHairForeground3", "FemaleCommonHairForeground4", "FemaleCommonHairForeground6"],

  FemaleUncommonArmor20: ["FemaleCommonHairForeground1", "FemaleCommonHairForeground3", "FemaleCommonHairForeground4"],
  FemaleUncommonArmor21: ["FemaleCommonHairForeground1", "FemaleCommonHairForeground3", "FemaleCommonHairForeground4"],
  FemaleUncommonArmor22: ["FemaleCommonHairForeground1", "FemaleCommonHairForeground3", "FemaleCommonHairForeground4"],

  FemaleCommonHairForeground1: ["Headgear11", "Headgear10", "Headgear3", "Headgear5", "Headgear8"],
  FemaleCommonHairForeground2: ["Headgear11", "Headgear10", "Headgear3", "Headgear5", "Headgear8"],
  FemaleCommonHairForeground3: ["Headgear11", "Headgear10"],
  FemaleCommonHairForeground4: ["Headgear11", "Headgear3", "Headgear10", "Headgear5", "Headgear8"],
  FemaleCommonHairForeground5: ["Headgear11", "Headgear10", "Headgear8"],
  FemaleCommonHairForeground6: ["Headgear11", "Headgear3", "Headgear10"],



  //Rare
  //Background
  FemaleRareHairBackground1: ["FemaleRareArmor10", "FemaleRareArmor11", "Headgear11", "Headgear10", "Headgear3", "Headgear8"],
  FemaleRareHairBackground2: ["FemaleRareArmor10", "FemaleRareArmor11", "Headgear11", "Headgear10", "Headgear3", "Headgear8"],
  FemaleRareHairBackground3: ["Headgear11", "Headgear10"],
  FemaleRareHairBackground4: ["Headgear3", "Headgear11", "Headgear10", "Headgear8"],
  FemaleRareHairBackground5: ["FemaleRareArmor10", "FemaleRareArmor11", "Headgear11", "Headgear10", "Headgear8"],

  //Foreground
  FemaleRareArmor10: ["FemaleRareHairForeground3", "FemaleRareHairForeground4"],
  FemaleRareArmor11: ["FemaleRareHairForeground3", "FemaleRareHairForeground4"],

  FemaleRareArmor20: ["FemaleRareHairForeground1", "FemaleRareHairForeground2", "FemaleRareHairForeground3",
                      "FemaleRareHairForeground5", "FemaleRareHairForeground4", "FemaleRareHairForeground6"],
  FemaleRareArmor21: ["FemaleRareHairForeground1", "FemaleRareHairForeground2", "FemaleRareHairForeground3",
                      "FemaleRareHairForeground5", "FemaleRareHairForeground4", "FemaleRareHairForeground6"],

  FemaleRareHairForeground1: ["Headgear11", "Headgear10", "Headgear3", "Headgear8"],
  FemaleRareHairForeground2: ["Headgear11", "Headgear10", "Headgear3", "Headgear8"],
  FemaleRareHairForeground3: ["Headgear11", "Headgear10"],
  FemaleRareHairForeground4: ["Headgear3", "Headgear11", "Headgear10", "Headgear8"],
  FemaleRareHairForeground5: ["Headgear11", "Headgear10", "Headgear8"],
  FemaleRareHairForeground6: ["Headgear3", "Headgear11", "Headgear10"],
  

  // Males
  MaleCommonBody1: ["MaleCommonHead12", "MaleCommonHead13", "MaleCommonHead14", "MaleCommonHead15",
                    "MaleCommonHead22", "MaleCommonHead23", "MaleCommonHead24", "MaleCommonHead25",
                    "Headgear3", "Headgear4", "Headgear9", "Headgear8"],
  MaleCommonBody2: ["MaleCommonHead11", "MaleCommonHead13", "MaleCommonHead14", "MaleCommonHead15",
                    "MaleCommonHead21", "MaleCommonHead23", "MaleCommonHead24", "MaleCommonHead25",
                    "Headgear3", "Headgear4", "Headgear9", "Headgear8"],
  MaleCommonBody3: ["MaleCommonHead11", "MaleCommonHead12", "MaleCommonHead14", "MaleCommonHead15",
                    "MaleCommonHead21", "MaleCommonHead22", "MaleCommonHead24", "MaleCommonHead25",
                    "Headgear3", "Headgear4", "Headgear9", "Headgear8"],
  MaleCommonBody4: ["MaleCommonHead11", "MaleCommonHead12", "MaleCommonHead13", "MaleCommonHead15",
                    "MaleCommonHead21", "MaleCommonHead22", "MaleCommonHead23", "MaleCommonHead25",
                    "Headgear3", "Headgear4", "Headgear9", "Headgear8"],
  MaleCommonBody5: ["MaleCommonHead11", "MaleCommonHead12", "MaleCommonHead13", "MaleCommonHead14",
                    "MaleCommonHead21", "MaleCommonHead22", "MaleCommonHead23", "MaleCommonHead24",
                    "Headgear3", "Headgear4", "Headgear9", "Headgear8"],

  MaleRareBody1: ["MaleRareHead12", "MaleRareHead22", 
                    "Headgear3", "Headgear4", "Headgear9", "Headgear8"],
  MaleRareBody2: ["MaleRareHead11", "MaleRareHead21", 
                  "Headgear3", "Headgear4", "Headgear9", "Headgear8"],

  MaleCommonHair1: ["Headgear11", "Headgear10"],
  MaleCommonHair2: ["Headgear11", "Headgear10"],
  MaleCommonHair3: ["Headgear11", "Headgear10"],
  MaleCommonHair4: ["Headgear11", "Headgear10"],
  MaleCommonHair5: ["Headgear11"],
  MaleCommonHair6: ["Headgear11", "Headgear10"],

  MaleRareHair1: ["Headgear11", "Headgear10"],
  MaleRareHair2: ["Headgear11", "Headgear10"],
  MaleRareHair3: ["Headgear11", "Headgear10"],
  MaleRareHair4: ["Headgear11", "Headgear10"],
  MaleRareHair5: ["Headgear11"],
  MaleRareHair6: ["Headgear11", "Headgear10"],
};

/**
 * Require combinations of files when constructing DNA, this bypasses the
 * randomization and weights.
 *
 * The layer order matters here, the key (left side) is an item within
 * the layer that comes first in the stack.
 * the items in the array are "required" items that should be pulled from folders
 * further in the stack
 */
const forcedCombinations = {
   Plante: ["Plante"],
   Vent: ["Vent"],

   FemaleCommonHairBackground1: ["FemaleCommonHairForegroundNone"],
   FemaleCommonHairBackground2: ["FemaleCommonHairForegroundNone"],
   FemaleCommonHairBackground3: ["FemaleCommonHairForegroundNone"],
   FemaleCommonHairBackground4: ["FemaleCommonHairForegroundNone"],
   FemaleCommonHairBackground5: ["FemaleCommonHairForegroundNone"],
   FemaleCommonHairBackground6: ["FemaleCommonHairForegroundNone"],
   FemaleCommonHairBackground7: [/*"Headgear11", */"FemaleCommonHairForegroundNone"],

   FemaleUncommonHairBackground1: ["FemaleCommonHairForegroundNone"],
   FemaleUncommonHairBackground2: ["FemaleCommonHairForegroundNone"],
   FemaleUncommonHairBackground3: ["FemaleCommonHairForegroundNone"],
   FemaleUncommonHairBackground4: ["FemaleCommonHairForegroundNone"],
   FemaleUncommonHairBackground5: ["FemaleCommonHairForegroundNone"],
   FemaleUncommonHairBackground6: ["FemaleCommonHairForegroundNone"],
   FemaleUncommonHairBackground7: [/*"Headgear11", */"FemaleCommonHairForegroundNone"],

   FemaleRareHairBackground1: ["FemaleRareHairForegroundNone"],
   FemaleRareHairBackground2: ["FemaleRareHairForegroundNone"],
   FemaleRareHairBackground3: ["FemaleRareHairForegroundNone"],
   FemaleRareHairBackground4: ["FemaleRareHairForegroundNone"],
   FemaleRareHairBackground5: ["FemaleRareHairForegroundNone"],
   FemaleRareHairBackground6: ["FemaleRareHairForegroundNone"],
   FemaleRareHairBackground7: [/*"Headgear11", */"FemaleRareHairForegroundNone"],

   //MaleCommonHairNone: ["Headgear11"],
};

/**
 * In the event that a filename cannot be the trait value name, for example when
 * multiple items should have the same value, specify
 * clean-filename: trait-value override pairs. Wrap filenames with spaces in quotes.
 */
const traitValueOverrides = {
  // Helmet: "Space Helmet",
  // "gold chain": "GOLDEN NECKLACE",
};

const extraMetadata = {};

const extraAttributes = () => [
  // Optionally, if you need to overwrite one of your layers attributes.
  // You can include the same name as the layer, here, and it will overwrite
  //
  // {
  // trait_type: "Bottom lid",
  //   value: ` Bottom lid # ${Math.random() * 100}`,
  // },
  // {
  //   display_type: "boost_number",
  //   trait_type: "Aqua Power",
  //   value: Math.random() * 100,
  // },
  // {
  //   display_type: "boost_number",
  //   trait_type: "Health",
  //   value: Math.random() * 100,
  // },
  // {
  //   display_type: "boost_number",
  //   trait_type: "Mana",
  //   value: Math.floor(Math.random() * 100),
  // },
];

const rarityDelimiter = "#";

const uniqueDnaTorrance = 10000;

/**
 * Set to true to always use the root folder as trait_type
 * Set to false to use weighted parent folders as trait_type
 * Default is true.
 */
const useRootTraitType = true;

module.exports = {
  animationUri,
  background,
  baseUri,
  buildDir,
  debugLogs,
  description,
  emptyLayerName,
  extraAttributes,
  extraMetadata,
  forcedCombinations,
  format,
  generateThumbnail,
  incompatible,
  layerConfigurations,
  layersDir,
  outputDir,
  thumbnailUri,
  rarityDelimiter,
  shuffleLayerConfigurations,
  startIndex,
  traitValueOverrides,
  uniqueDnaTorrance,
  useRootTraitType,
  outputType,
};
