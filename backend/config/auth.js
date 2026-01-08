import dotenv from "dotenv";
dotenv.config(); // variables from the .env file are loaded

export const jwtConfig= {
    secret: process.env.JWT_SECRET,
    expiresIn:process.env.JWT_SECRET || "1h",
};

