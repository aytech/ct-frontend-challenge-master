const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const email409 = ['user0@comtravo.com', 'user1@comtravo.com'];
const email500 = 'user5@comtravo.com';

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (['POST', 'PUT'].includes(req.method)) {
    const email = req.body.email;
    if (email409.includes(req.body.email)) {
      res.sendStatus(409);
    } else if (email === email500) {
      res.sendStatus(500);
    } else {
      // Continue to JSON Server router
      next();
    }
  } else {
    // Continue to JSON Server router
    next();
  }
});

// Use default router
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});
