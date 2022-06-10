import express from "express";
import { Authorize } from "../middlewares/authorize.mjs";
import { comment_route } from "./Comment.mjs";
import { post_route } from "./Post.mjs";
import { tag_route } from "./Tag.mjs";
import { login_route, user_route } from "./User.mjs";
import swaggerUi from "swagger-ui-express";
import swagDocs from "./../../swagger.json" assert { type: "json" };
export const api_route = express.Router();

//auth
api_route.use("/authors", [Authorize, user_route]);
api_route.use("/tags", [Authorize, tag_route]);
api_route.use("/posts", [Authorize, post_route]);

//no auth
api_route.use("/docs", swaggerUi.serve, swaggerUi.setup(swagDocs));
api_route.use("/comments", comment_route);
api_route.use("/auth", login_route);
