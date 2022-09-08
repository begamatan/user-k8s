const { auth } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = (app) => {
  const router = require("express").Router();

  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  router.get("/", auth.verifyToken, controller.index);
  router.get("/:id", auth.verifyToken, controller.show);
  router.post("/", [auth.verifyToken, auth.isAdmin], controller.store);
  router.put("/:id", [auth.verifyToken, auth.isAdmin], controller.update);
  router.delete("/:id", [auth.verifyToken, auth.isAdmin], controller.destroy);

  app.use("/api/v1/user", router);
};
