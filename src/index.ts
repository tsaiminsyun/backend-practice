import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`Service is runing on http://localhost:${env.port}`);
});
