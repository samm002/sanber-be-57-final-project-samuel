import express from "express";
import routes from "@/routes";
import bodyParser from "body-parser";
import path from "path";

import db from "@/utils/database";
import homeController from "./controllers/home.controller";

const app = express();
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || "http://localhost";

// Configuring database
db();

// Setting EJS as templating engine and configure the view directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configuring middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuring routes
app.use("/api", routes);

// Configuring home page route
app.get("/", homeController.homePage);

app.listen(PORT, () => {
  console.log(`Server is running at ${HOSTNAME || "http://localhost"}:${PORT}`);
});