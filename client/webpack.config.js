const createExpoWebpackConfig = require("@expo/webpack-config");
module.exports = async function(env, argv) {
  env.mode = "development";
  const config = await createExpoWebpackConfig({
    ...env,
    
    // Passing true will enable the default Workbox + Expo SW configuration.
    //offline: true,
  }, argv);
  return config;
};