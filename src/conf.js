module.exports = {
  redditKey: process.env.REDDIT_KEY,
  redditSecret: process.env.REDDIT_SECRET,
  baseUrl: process.env.GOULASH_URL,
  port: process.env.GOULASH_PORT,

  test: {
    reddit: {
      username: process.env.REDDIT_USERNAME,
      password: process.env.REDDIT_PASSWORD
    }
  }
};
