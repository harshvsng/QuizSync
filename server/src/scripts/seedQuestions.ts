import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import { connectDB } from "../infra/database/mongodb";
import QuestionModel from "../models/question.model";
import { loadEnvFile } from "process";
import { validateEnvVars } from "../utils/env";

async function seedQuestions() {
  try {
    loadEnvFile(".env");
    validateEnvVars();
    await connectDB();

    const directory = path.join(__dirname, "../data/questions");

    const files = await fs.readdir(directory);

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const filePath = path.join(directory, file);

      const content = await fs.readFile(filePath, "utf-8");

      const questions = JSON.parse(content);

      await QuestionModel.insertMany(questions, {
        ordered: false,
      });

      console.log(`✔ Imported ${file}`);
    }

    console.log("Done.");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

seedQuestions();
