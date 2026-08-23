import { swaggerToApis } from "swagger-to-apis";

swaggerToApis({
  url: "http://localhost:8000/api.json", // Change to your Swagger API docs URL
  output: "./src",
});
