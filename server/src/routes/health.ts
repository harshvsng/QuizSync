import express, { type Router, type Request, type Response } from "express";

const router: Router = express.Router();

router.get("/", (_req: Request, res: Response) => {
    res.json({ message: "Application is healthy" });
});

export default router;
