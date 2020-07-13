var default_config = require("./default.json");

module.exports = (function() {
  var mode = (process.env.NODE_ENV || "development").toLowerCase(),
    mode_config,
    config;

  try {
    mode_config = require("./" + mode);
  } catch (err) {
    console.error("Cannot find mode " + mode + " config file!!!");
    process.exit(-1);
  }

  config = {
    ...default_config,
    ...mode_config,
  };

  return config;
})();
