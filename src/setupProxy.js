const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = {
  target: 'https://www.gitlab.com',
  changeOrigin: true
};
module.exports = function(app) {
  app.use(
    '/gitlab',
    createProxyMiddleware(proxy)
  );
};