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
    growEditionSizeTo: totalSupply*0.9/2,
    namePrefix: "Female Common", // Use to add a name to Metadata `name:`
    layersOrder: [
      { name: "Background" },
      { name: "QioraBackground" },
      { name: "FemaleCommonBody" },
      { name: "FemaleCommonHead" },
      { name: "EyesCommon" },
      { name: "FemaleCommonHair" },
      { name: "FemaleCommonArmor" },
      { name: "Headgear" },
      { name: "QioraForeground" },
    ],
  },
  {
    growEditionSizeTo: totalSupply*0.99/2,
    namePrefix: "Female Uncommon", // Use to add a name to Metadata `name:`
    layersOrder: [
      { name: "Background" },
      { name: "QioraBackground" },
      { name: "Back" },
      { name: "FemaleCommonBody" },
      { name: "FemaleCommonHead" },
      { name: "EyesCommon" },
      { name: "FemaleCommonHair" },
      { name: "FemaleUncommonArmor" },
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
      { name: "Back" },
      { name: "FemaleRareBody" },
      { name: "FemaleRareHead" },
      { name: "EyesRare" },
      { name: "FemaleRareHair" },
      { name: "FemaleRareArmor" },
      { name: "Headgear" },
      { name: "QioraForeground" },
    ],
  },
  {
    growEditionSizeTo: totalSupply/2 + totalSupply/2*0.9,
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
    growEditionSizeTo: totalSupply/2 + totalSupply/2*0.99,
    namePrefix: "Male Uncommon", // Use to add a name to Metadata `name:`
    layersOrder: [
      { name: "Background" },
      { name: "QioraBackground" },
      { name: "Back" },
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
      { name: "Back" },
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
  //FemaleCommonBody1: ["FemaleCommonHeadSkin2", "FemaleCommonHeadSkin3", "FemaleCommonHeadSkin4", "FemaleCommonHeadSkin5"],
  /*FemaleCommonBody1: ["FemaleCommonHead12", "FemaleCommonHead13", "FemaleCommonHead14", "FemaleCommonHead15",
                      "FemaleCommonHead22", "FemaleCommonHead23", "FemaleCommonHead24", "FemaleCommonHead25"],*/
  FemaleCommonBody1: ["FemaleCommonHead12", "FemaleCommonHead13", "FemaleCommonHead14", "FemaleCommonHead15",
                      "FemaleCommonHead22", "FemaleCommonHead23", "FemaleCommonHead24", "FemaleCommonHead25"],
  FemaleCommonBody2: ["FemaleCommonHead11", "FemaleCommonHead13", "FemaleCommonHead14", "FemaleCommonHead15",
                      "FemaleCommonHead21", "FemaleCommonHead23", "FemaleCommonHead24", "FemaleCommonHead25"],
  FemaleCommonBody3: ["FemaleCommonHead11", "FemaleCommonHead12", "FemaleCommonHead14", "FemaleCommonHead15",
                      "FemaleCommonHead21", "FemaleCommonHead22", "FemaleCommonHead24", "FemaleCommonHead25"],
  FemaleCommonBody4: ["FemaleCommonHead11", "FemaleCommonHead12", "FemaleCommonHead13", "FemaleCommonHead15",
                      "FemaleCommonHead21", "FemaleCommonHead22", "FemaleCommonHead23", "FemaleCommonHead25"],
  FemaleCommonBody5: ["FemaleCommonHead11", "FemaleCommonHead12", "FemaleCommonHead13", "FemaleCommonHead14",
                      "FemaleCommonHead21", "FemaleCommonHead22", "FemaleCommonHead23", "FemaleCommonHead24"],

  MaleCommonBody1: ["MaleCommonHead12", "MaleCommonHead13", "MaleCommonHead14", "MaleCommonHead15",
                    "MaleCommonHead22", "MaleCommonHead23", "MaleCommonHead24", "MaleCommonHead25"],
  MaleCommonBody2: ["MaleCommonHead11", "MaleCommonHead13", "MaleCommonHead14", "MaleCommonHead15",
                    "MaleCommonHead21", "MaleCommonHead23", "MaleCommonHead24", "MaleCommonHead25"],
  MaleCommonBody3: ["MaleCommonHead11", "MaleCommonHead12", "MaleCommonHead14", "MaleCommonHead15",
                    "MaleCommonHead21", "MaleCommonHead22", "MaleCommonHead24", "MaleCommonHead25"],
  MaleCommonBody4: ["MaleCommonHead11", "MaleCommonHead12", "MaleCommonHead13", "MaleCommonHead15",
                    "MaleCommonHead21", "MaleCommonHead22", "MaleCommonHead23", "MaleCommonHead25"],
  MaleCommonBody5: ["MaleCommonHead11", "MaleCommonHead12", "MaleCommonHead13", "MaleCommonHead14",
                    "MaleCommonHead21", "MaleCommonHead22", "MaleCommonHead23", "MaleCommonHead24"],
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
   //FemaleCommonBody1: ["FemaleCommonHeadSkin1"],
   /*FemaleCommonBody1: ["FemaleCommonHead11", "FemaleCommonHead21"],
   FemaleCommonBody2: ["FemaleCommonHead12", "FemaleCommonHead22"],
   FemaleCommonBody3: ["FemaleCommonHead13", "FemaleCommonHead23"],
   FemaleCommonBody4: ["FemaleCommonHead14", "FemaleCommonHead24"],
   FemaleCommonBody5: ["FemaleCommonHead15", "FemaleCommonHead25"],
   FemaleRareBody1: ["FemaleRareHead11", "FemaleRareHead21"],
   FemaleRareBody2: ["FemaleRareHead12", "FemaleRareHead22"],

   MaleCommonBody1: ["MaleCommonHead11", "MaleCommonHead21"],
   MaleCommonBody2: ["MaleCommonHead12", "MaleCommonHead22"],
   MaleCommonBody3: ["MaleCommonHead13", "MaleCommonHead23"],
   MaleCommonBody4: ["MaleCommonHead14", "MaleCommonHead24"],
   MaleCommonBody5: ["MaleCommonHead15", "MaleCommonHead25"],
   MaleRareBody1: ["MaleRareHead11", "MaleRareHead21"],
   MaleRareBody2: ["MaleRareHead12", "MaleRareHead22"],*/
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
