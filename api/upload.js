import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";

// ---------------- CONFIG ----------------
cloudinary.config({
  cloud_name: "dl8dufej5",
  api_key: "553428338585279",
  api_secret: "FSLtEJT0qhinIKMECr_M31LTW1A"
});

// ---------------- Vercel config ----------------
export const config = { api: { bodyParser: false } };

// ---------------- UPLOAD HANDLER ----------------
export default async function handler(req, res) {
  const form = formidable({ maxFileSize: 50 * 1024 * 1024 }); // 50 MB

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) throw err;

      const file = files.file[0];

      // Upload to Cloudinary
      const uploaded = await cloudinary.uploader.upload(file.filepath, {
        resource_type: "auto" // supports images, PDFs, videos, etc.
      });

      res.status(200).json({ status: "success", fileUrl: uploaded.secure_url });

    } catch (error) {
      res.status(500).json({ status: "error", message: error.toString() });
    }
  });
        }
