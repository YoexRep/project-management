import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

/**ROUTE IMPORTS */

import projectRoutes from "./routes/projectRoutes"
import taskRoutes from "./routes/taskRoutes"
import searchRoutes from "./routes/searchRoutes"
import userRoutes from "./routes/userRoutes"
import teamRoutes from "./routes/teamRoutes"

//Configurations

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cors());

//ROUTES 
app.get("/", (req, res) =>{

    res.send("This is home route");
});

//Ends points de projects, no tengo que hacer mas nada ya que lo importo todos. 
app.use("/projects", projectRoutes);


//Ends points de tasks,
app.use("/tasks", taskRoutes);


//Ends points de search,
app.use("/search", searchRoutes);

//Ends points de users,
app.use("/users", userRoutes);

//Ends points de teams,
app.use("/teams", teamRoutes);



//SERVER
const port = Number(process.env.PORT) || 3000;

app.listen(port, "0.0.0.0", () => {

    console.log(`Server running on ports ${port}`);
})




