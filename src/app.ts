/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import * as projectConst from "./config/constants";
import http from "http";
import express, { Request, Response, NextFunction } from "express";
import { get } from "lodash-es";
import middlewares from "./config/middlewares";
import router from "./config/routes";
import { sendErrorResponse, UserError } from "./config/errors";

const app = express();

const server = http.createServer(app);

app.set("trust proxy", true);

// register middlewares
app.use(middlewares);

// register routes
app.use(router);

// alive check
app.get("/", (_, res) => res.send("Server Online"));

// app.get("/log-updates", (_, res) => res.json(updatesData));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  sendErrorResponse(res, err as UserError);
});

// await getClient();

server.listen(
  projectConst.NODE_ENV === "test" ? 0 : projectConst.PORT,
  projectConst.HOST,
  () => {
    let port: string | number = projectConst.PORT;
    let host = projectConst.HOST;

    const serverAddress = server.address();
    const serverAddressPort = get(serverAddress, "port");
    const serverAddressHost = get(serverAddress, "address");

    if (serverAddressPort) {
      port = serverAddressPort;
    }

    if (serverAddressHost) {
      host = serverAddressHost;
    }

    if (projectConst.NODE_ENV !== "test") {
      console.debug(`⚡️[server]: Server is running at http://${host}:${port}`);
    }
  }
);

export { app, server };
