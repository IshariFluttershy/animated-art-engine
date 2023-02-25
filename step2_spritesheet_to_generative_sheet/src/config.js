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
      { name: "Background"},
      { name: "QioraBackground"}, // trait a supprimer des metadatas
      { name: "FemaleCommonBody", trait: "Body" },
      { name: "FemaleCommonHead", trait: "Head" },
      { name: "EyesCommon", trait: "Eyes" },
      { name: "FemaleCommonHairBackground"}, // trait a supprimer des metadatas
      { name: "FemaleCommonArmor", trait: "Armor" },
      { name: "FemaleCommonHairForeground", trait: "Hair" },
      { name: "Headgear" },
      { name: "QioraForeground", trait: "Qiora"},
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

   FemaleCommonHairBackground1: ["FemaleCommonHairForegroundNone1"],
   FemaleCommonHairBackground2: ["FemaleCommonHairForegroundNone2"],
   FemaleCommonHairBackground3: ["FemaleCommonHairForegroundNone3"],
   FemaleCommonHairBackground4: ["FemaleCommonHairForegroundNone4"],
   FemaleCommonHairBackground5: ["FemaleCommonHairForegroundNone5"],
   FemaleCommonHairBackground6: ["FemaleCommonHairForegroundNone6"],
   FemaleCommonHairBackground7: ["FemaleCommonHairForegroundNone7"],

   FemaleUncommonHairBackground1: ["FemaleCommonHairForegroundNone1"],
   FemaleUncommonHairBackground2: ["FemaleCommonHairForegroundNone2"],
   FemaleUncommonHairBackground3: ["FemaleCommonHairForegroundNone3"],
   FemaleUncommonHairBackground4: ["FemaleCommonHairForegroundNone4"],
   FemaleUncommonHairBackground5: ["FemaleCommonHairForegroundNone5"],
   FemaleUncommonHairBackground6: ["FemaleCommonHairForegroundNone6"],
   FemaleUncommonHairBackground7: ["FemaleCommonHairForegroundNone7"],

   FemaleRareHairBackground1: ["FemaleRareHairForegroundNone1"],
   FemaleRareHairBackground2: ["FemaleRareHairForegroundNone2"],
   FemaleRareHairBackground3: ["FemaleRareHairForegroundNone3"],
   FemaleRareHairBackground4: ["FemaleRareHairForegroundNone4"],
   FemaleRareHairBackground5: ["FemaleRareHairForegroundNone5"],
   FemaleRareHairBackground6: ["FemaleRareHairForegroundNone6"],
   FemaleRareHairBackground7: ["FemaleRareHairForegroundNone7"],

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
  "FemaleCommonHairForeground1": "Hair 1",
  "FemaleCommonHairForeground2": "Hair 2",
  "FemaleCommonHairForeground3": "Hair 3",
  "FemaleCommonHairForeground4": "Hair 4",
  "FemaleCommonHairForeground5": "Hair 5",
  "FemaleCommonHairForeground6": "Hair 6",

  "FemaleCommonHairForegroundNone1": "Hair 1",
  "FemaleCommonHairForegroundNone2": "Hair 2",
  "FemaleCommonHairForegroundNone3": "Hair 3",
  "FemaleCommonHairForegroundNone4": "Hair 4",
  "FemaleCommonHairForegroundNone5": "Hair 5",
  "FemaleCommonHairForegroundNone6": "Hair 6",
  "FemaleCommonHairForegroundNone7": "Hair 7",

  "FemaleRareHairForeground1": "Phantom Hair 1",
  "FemaleRareHairForeground2": "Phantom Hair 2",
  "FemaleRareHairForeground3": "Phantom Hair 3",
  "FemaleRareHairForeground4": "Phantom Hair 4",
  "FemaleRareHairForeground5": "Phantom Hair 5",
  "FemaleRareHairForeground6": "Phantom Hair 6",

  "FemaleRareHairForegroundNone1": "Phantom Hair 1",
  "FemaleRareHairForegroundNone2": "Phantom Hair 2",
  "FemaleRareHairForegroundNone3": "Phantom Hair 3",
  "FemaleRareHairForegroundNone4": "Phantom Hair 4",
  "FemaleRareHairForegroundNone5": "Phantom Hair 5",
  "FemaleRareHairForegroundNone6": "Phantom Hair 6",
  "FemaleRareHairForegroundNone7": "Phantom Hair 7",

  "MaleCommonHair1": "Hair 1",
  "MaleCommonHair2": "Hair 2",
  "MaleCommonHair3": "Hair 3",
  "MaleCommonHair4": "Hair 4",
  "MaleCommonHair5": "Hair 5",
  "MaleCommonHair6": "Hair 6",
  "MaleCommonHairNone": "Hair 7",

  "MaleRareHair1": "Phantom Hair 1",
  "MaleRareHair2": "Phantom Hair 2",
  "MaleRareHair3": "Phantom Hair 3",
  "MaleRareHair4": "Phantom Hair 4",
  "MaleRareHair5": "Phantom Hair 5",
  "MaleRareHair6": "Phantom Hair 6",
  "MaleRareHairNone": "Phantom Hair 7",

  "Headgear1": "Headgear 1",
  "Headgear2": "Headgear 2",
  "Headgear3": "Headgear 3",
  "Headgear4": "Headgear 4",
  "Headgear5": "Headgear 5",
  "Headgear6": "Headgear 6",
  "Headgear7": "Headgear 7",
  "Headgear8": "Headgear 8",
  "Headgear9": "Headgear 9",
  "Headgear10": "Headgear 10",
  "Headgear11": "Headgear 11",

  "Background1": "Background 1",
  "Background2": "Background 2",
  "Background3": "Background 3",
  "Background4": "Background 4",
  "Background5": "Background 5",
  "Background6": "Background 6",
  "Background7": "Background 7",

  "FemaleCommonBody1": "Skin tone 1",
  "FemaleCommonBody2": "Skin tone 2",
  "FemaleCommonBody3": "Skin tone 3",
  "FemaleCommonBody4": "Skin tone 4",
  "FemaleCommonBody5": "Skin tone 5",

  "FemaleRareBody1": "Phantom skin tone 1",
  "FemaleRareBody2": "Phantom skin tone 1",

  "MaleCommonBody1": "Skin tone 1",
  "MaleCommonBody2": "Skin tone 2",
  "MaleCommonBody3": "Skin tone 3",
  "MaleCommonBody4": "Skin tone 4",
  "MaleCommonBody5": "Skin tone 5",

  "MaleRareBody1": "Phantom skin tone 1",
  "MaleRareBody2": "Phantom skin tone 2",

  "LightEyes1": "Eyes 1",
  "LightEyes2": "Eyes 2",
  "LightEyes3": "Eyes 3",
  "LightEyes4": "Eyes 4",
  "LightEyes5": "Eyes 5",
  "LightEyes6": "Eyes 6",
  "LightEyes7": "Eyes 7",

  "DarkEyes1": "Dark Eyes 1",
  "DarkEyes2": "Dark Eyes 2",
  "DarkEyes3": "Dark Eyes 3",
  "DarkEyes4": "Dark Eyes 4",
  "DarkEyes5": "Dark Eyes 5",
  "DarkEyes6": "Dark Eyes 6",
  "DarkEyes7": "Dark Eyes 7",

  "FemaleCommonHead11": "Head 1",
  "FemaleCommonHead12": "Head 1",
  "FemaleCommonHead13": "Head 1",
  "FemaleCommonHead14": "Head 1",
  "FemaleCommonHead15": "Head 1",
  "FemaleCommonHead21": "Head 2",
  "FemaleCommonHead22": "Head 2",
  "FemaleCommonHead23": "Head 2",
  "FemaleCommonHead24": "Head 2",
  "FemaleCommonHead25": "Head 2",

  "MaleCommonHead11": "Head 1",
  "MaleCommonHead12": "Head 1",
  "MaleCommonHead13": "Head 1",
  "MaleCommonHead14": "Head 1",
  "MaleCommonHead15": "Head 1",
  "MaleCommonHead21": "Head 2",
  "MaleCommonHead22": "Head 2",
  "MaleCommonHead23": "Head 2",
  "MaleCommonHead24": "Head 2",
  "MaleCommonHead25": "Head 2",

  "FemaleCommonArmor10": "Armor 1.1",
  "FemaleCommonArmor11": "Armor 1.2",
  "FemaleCommonArmor12": "Armor 1.3",
  "FemaleCommonArmor13": "Armor 1.4",
  "FemaleCommonArmor20": "Armor 2.1",
  "FemaleCommonArmor21": "Armor 2.2",
  "FemaleCommonArmor22": "Armor 2.3",
  "FemaleCommonArmor23": "Armor 2.4",
  "FemaleCommonArmor30": "Armor 3.1",
  "FemaleCommonArmor31": "Armor 3.2",
  "FemaleCommonArmor32": "Armor 3.3",
  "FemaleCommonArmor33": "Armor 3.4",

  "FemaleUncommonArmor10": "Armor 4.1",
  "FemaleUncommonArmor11": "Armor 4.2",
  "FemaleUncommonArmor12": "Armor 4.3",
  "FemaleUncommonArmor20": "Armor 5.1",
  "FemaleUncommonArmor21": "Armor 5.2",
  "FemaleUncommonArmor22": "Armor 5.3",

  "FemaleRareArmor10": "Armor 6.1",
  "FemaleRareArmor11": "Armor 6.2",
  "FemaleRareArmor20": "Armor 7.1",
  "FemaleRareArmor21": "Armor 7.2",

  "MaleCommonArmor10": "Armor 1.1",
  "MaleCommonArmor11": "Armor 1.2",
  "MaleCommonArmor12": "Armor 1.3",
  "MaleCommonArmor13": "Armor 1.4",
  "MaleCommonArmor20": "Armor 2.1",
  "MaleCommonArmor21": "Armor 2.2",
  "MaleCommonArmor22": "Armor 2.3",
  "MaleCommonArmor23": "Armor 2.4",
  "MaleCommonArmor30": "Armor 3.1",
  "MaleCommonArmor31": "Armor 3.2",
  "MaleCommonArmor32": "Armor 3.3",
  "MaleCommonArmor33": "Armor 3.4",

  "MaleUncommonArmor10": "Armor 4.1",
  "MaleUncommonArmor11": "Armor 4.2",
  "MaleUncommonArmor12": "Armor 4.3",
  "MaleUncommonArmor20": "Armor 5.1",
  "MaleUncommonArmor21": "Armor 5.2",
  "MaleUncommonArmor22": "Armor 5.3",

  "MaleRareArmor10": "Armor 6.1",
  "MaleRareArmor11": "Armor 6.2",
  "MaleRareArmor20": "Armor 7.1",
  "MaleRareArmor21": "Armor 7.2",
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
