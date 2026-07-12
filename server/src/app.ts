import express, { type Express } from "express";
import router from "./routes";

const app: Express = express();

app.use("/", router);

app.listen(4000, () => {
    console.log(`Application is running at 4000`);
});

// TODO: basic email-password login. and direct start then. run by tsx
