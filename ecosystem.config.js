const getAppConfig = (port = 8080) => ({
  name: `werewolf-${port}`,
  script: "./src/backend/server.ts",
  interpreter: "bun",
  env: {
    PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`,
    PORT: port,
  },
});

module.exports = {
  apps: [getAppConfig()],
};
