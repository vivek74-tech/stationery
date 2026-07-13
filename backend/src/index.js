import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
.then(() => {

    app.listen(process.env.PORT, () => {

        console.log(
            `Server Running On Port ${process.env.PORT}`
        );

    });

})
.catch((err)=>{

    console.log(err);

});