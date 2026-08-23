import SwaggerToApi from "swagger-to-apis";

SwaggerToApi.swaggerToApis({
  apiUrl: "http://localhost:8000/api/api.json", // Change to your Swagger API docs URL
  reslib: "./src/",
});
