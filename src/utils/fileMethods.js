import fs from "fs";
import { PdfReader } from "pdfreader";
import docxParser from "docx-parser";
import dotenv from "dotenv";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const extractContentFromFile = async (filePath, ext) => {
  const isURL =
    filePath.startsWith("http://") || filePath.startsWith("https://");

  if (isURL) {
    try {
      const response = await axios({
        url: filePath,
        method: "GET",
        responseType: "arraybuffer",
      });

      if (response.status !== 200) {
        throw new Error(
          `extractContentFromFile: Failed to download file. Status code: ${response.status}`
        );
      }

      const tempFilePath = path.join(__dirname, `temp.${ext}`);
      fs.writeFileSync(tempFilePath, response.data);

      const content = await extractContentFromLocalFile(tempFilePath);

      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }

      return content.extractedText;
    } catch (error) {
      console.error("Error during file download and extraction:", error);
      throw new Error("Failed to download and extract content from the file.");
    }
  } else {
    return extractContentFromLocalFile(filePath);
  }
};

const extractContentFromLocalFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const ext = path.extname(filePath).toLowerCase();

    if (ext == ".pdf") {
      extractTextFromPDF(filePath)
        .then((text) => resolve({ extractedText: text }))
        .catch((err) => {
          console.error("Error extracting Docx content:", err);
          reject(new Error("Failed to extract text"));
        });
    } else if (ext == ".docx") {
      docxParser.parseDocx(
        filePath,
        (data) => {
          resolve({ extractedText: data.replace(/\s+/g, " ") });
        },
        (err) => {
          console.error("Error extracting Docx content:", err);
          reject(new Error("Failed to extract content from Docx"));
        }
      );
    } else {
      resolve({ extractedText: "No summary text for this file" });
    }
  }).finally(() => fs.unlinkSync(filePath));
};

const extractTextFromPDF = (filePath) => {
  return new Promise((resolve, reject) => {
    const text = [];
    new PdfReader().parseFileItems(filePath, (err, item) => {
      if (err) {
        reject(err);
      } else if (!item) {
        resolve(text.join(" "));
      } else if (item.text) {
        text.push(item.text);
      }
    });
  });
};
