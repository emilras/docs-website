const path = require('path');
const vfile = require('vfile');
const { CONTENT_DIR, TYPES } = require('../constants');

const DEFAULT_EXTENSION = '.mdx';

const EXTENSIONS = {
  [TYPES.ATTRIBUTE_DEFINITION]: '.md',
  [TYPES.EVENT_DEFINITION]: '.md',
  [TYPES.WHATS_NEW]: '.md',
};

const toVFile = (
  doc,
  { baseDir = CONTENT_DIR, redirects, dirname, filename }
) => {
  const url = new URL(doc.docUrl);
  redirects = redirects || [];
  const basename = path.basename(url.pathname);
  const extension = EXTENSIONS[doc.type] || DEFAULT_EXTENSION;
  dirname = dirname || path.dirname(url.pathname);
  filename = filename || (doc.type === TYPES.LANDING_PAGE ? 'index' : basename);

  if (typeof dirname === 'function') {
    dirname = dirname(doc);
  }

  if (typeof filename === 'function') {
    filename = filename(doc);
  }

  return vfile({
    path: path.join(baseDir, dirname, filename + extension),
    contents: doc.body || '',
    data: {
      doc,
      topics: getTopics(doc),
      redirects: redirects[`node${doc.docId}`] || [],
    },
  });
};

const getTopics = (doc) => {
  return Object.entries(doc)
    .reduce(
      (topics, [key, value]) =>
        key.startsWith('topic_') ? [...topics, value] : topics,
      []
    )
    .filter(Boolean);
};

module.exports = toVFile;
