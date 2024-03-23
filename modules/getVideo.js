const axios = require("axios")
/**
 * Download video
 * @param {string} url 
 * @param {'facebook'|'telegram'} type 
 */
function GetVideo(url, type) {
  return axios({
    method: "get",
    url: `${process.env.API_URL}/api/${type}/media?url=${url}`,
  });
}

module.exports = GetVideo