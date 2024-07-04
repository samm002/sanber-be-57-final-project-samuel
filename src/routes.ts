import express from "express";

import aclMiddleware from "./middlewares/acl.middleware";
import authMiddleware from "./middlewares/auth.middleware";
import uploadMiddleware from "./middlewares/upload.middleware";
import authController from "./controllers/auth.controller";
import homeController from "./controllers/home.controller";
import ordersController from "./controllers/orders.controller";
import categoriesController from "./controllers/categories.controller";
import productsController from "./controllers/products.controller";
import uploadController from "./controllers/upload.controller";

const router = express.Router();

// API base route
router.get("/", homeController.apiHome);

// Authentication routes
router.get("/auth/me", [authMiddleware, aclMiddleware(["admin", "user"])], authController.me);
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.put("/auth/profile", authMiddleware, authController.profile);

// Categories routes
router.get("/categories", categoriesController.findAll);
router.get("/categories/:id", categoriesController.findOne);
router.post("/categories", categoriesController.create);
router.put("/categories/:id", categoriesController.update);
router.delete("/categories/:id", categoriesController.delete);

// Products routes
router.get("/products", productsController.findAll);
router.get("/products/:id", productsController.findOne);
router.post("/products", productsController.create);
router.put("/products/:id", productsController.update);
router.delete("/products/:id", productsController.delete);

// Order routes
router.get("/orders", authMiddleware, ordersController.findAllUserOrder);
router.get("/orders/:id", authMiddleware, ordersController.findOne);
router.post("/orders", authMiddleware, ordersController.create);
router.put("/orders/:id", authMiddleware, ordersController.update);
router.delete("/orders/:id", authMiddleware, ordersController.delete);

// Upload file routes
router.post("/upload", uploadMiddleware.single, uploadController.single);
router.post("/uploads", uploadMiddleware.multiple, uploadController.multiple);

export default router;
