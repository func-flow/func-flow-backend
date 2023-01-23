import express, { Request } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

morgan.token("body", (req: Request) => JSON.stringify(req.body));

const middlewares = [
  cors(),
  express.urlencoded({ extended: true }),
  express.json({ limit: "500mb" }),
  helmet(),
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
];

export default middlewares;
