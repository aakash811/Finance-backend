import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

export const setupSwagger = (app: Express) => {
  const swaggerPath = path.join(__dirname, "../../swagger.yaml");
  const swaggerDocument = YAML.load(swaggerPath);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};