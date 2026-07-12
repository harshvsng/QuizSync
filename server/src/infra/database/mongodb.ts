import mongoose from "mongoose";

export const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }
    await mongoose.connect(process.env[`DATABASE_URL`]!, {
        appName: `RideFlow`,
    });

    console.log(`Connected to the MongoDB`);
};
