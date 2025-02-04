const indentedCodeBlock = require('./indentedCodeBlock');
const callouts = require('./callouts');
const clamshells = require('./clamshells');
const exampleBoxes = require('./exampleBoxes');
const videos = require('./videos');
const images = require('./images');
const tables = require('./tables');
const buttons = require('./buttons');
const icons = require('./icons');
const codeBlocks = require('./codeBlocks');
const inlineCodeBlocks = require('./inlineCodeBlocks');
const landingPageTileGrid = require('./landingPageTileGrid');
const landingPageImagePlacement = require('./landingPageImagePlacement');
const collapseLandingPageTileGrids = require('./collapseLandingPageTileGrids');
const landingPageButtonType = require('./landingPageButtonType');
const tocLinks = require('./tocLinks');
const watermarks = require('./watermarks');

module.exports = [
  codeBlocks,
  inlineCodeBlocks,
  indentedCodeBlock,
  callouts,
  clamshells,
  exampleBoxes,
  videos,
  images,
  tables,
  buttons,
  icons,
  landingPageTileGrid,
  landingPageImagePlacement,
  collapseLandingPageTileGrids,
  landingPageButtonType,
  tocLinks,
  watermarks,
];
