const path = require('path');
const yaml = require('js-yaml');

const CONFIG_PATH = '.github';

function parseConfig(content) {
  return yaml.safeLoad(Buffer.from(content, 'base64').toString()) || {};
}

/**
 * @returns {Promise<Object.<string, string | string[]>>}
 */
module.exports = async function getConfig(github, fileName, { owner, repo, ref }) {
  try {
    const response = await github.repos.getContent({
      owner,
      repo,
      ref,
      path: path.posix.join(CONFIG_PATH, fileName),
    });

    return parseConfig(response.data.content);
  } catch (error) {
    if (error.code === 404) {
      return null;
    }

    throw error;
  }
};
