import { Request, Response } from "express";

export default {
  apiHome(req: Request, res: Response) {
    try {
      res.status(200).send("<h1>Welcome to my API!</h1><h3>Repository link : <a href=\"https://github.com/repo-viewer002/typescript-app.git\">typescript-app</a></h3>");

    } catch (error) {
      const _err = error as Error;

      res.status(500).json({
        message: "Error displaying api base url",
        error: _err.message,
      });
    }
  },
  homePage(req: Request, res: Response) {
    try {
      res.render('index');

    } catch (error) {
      const _err = error as Error;

      res.status(500).json({
        message: "Error displaying home page",
        error: _err.message,
      });
    }
  }
}