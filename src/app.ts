/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import * as projectConst from "./config/constants";
import http from "http";
import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import * as Sentry from "@sentry/node";
import { get, isString } from "lodash-es";
import middlewares from "./config/middlewares";
import router from "./config/routes";
//import passportConfig from "./config/passport";
import {
  ErrorWithHttpCode,
  sendErrorResponse,
  UserError, 
} from "./config/errors";


const app = express();

const server = http.createServer(app);

//passportConfig();

app.set("trust proxy", true);

/*

if (projectConst.NODE_ENV !== "development") {
  Sentry.init({
    dsn: projectConst.SENTRY_DSN,
    environment: projectConst.SENTRY_ENV,
  });

  //Attach sentry error handler
  app.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError(error) {
        const errorCode = (error as unknown as ErrorWithHttpCode).code;
        // Capture only 5xx errors
        if (errorCode >= 500) {
          return true;
        }

        return false;
      },
    })
  );
}
*/
// register middlewares
app.use(middlewares);

// register routes
//app.post("/upload", upload.single("file"), uploadHandler);

app.use(router);

// alive check
app.get("/", (_, res) => res.send("Server Online"));

//app.get("/log-updates", (_, res) => res.json(updatesData));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  sendErrorResponse(res, err as UserError);
});

//await getClient();

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
