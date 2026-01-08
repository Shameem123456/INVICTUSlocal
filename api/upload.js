import formidable from "formidable";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";

// HARD-CODED CONFIG
cloudinary.config({
  cloud_name: "dl8dufej5",
  api_key: "553428338585279",
  api_secret: "FSLtEJT0qhinIKMECr_M31LTW1A"
});

const SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const form = formidable({ maxFileSize: 50 * 1024 * 1024 }); // 50 MB

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) throw err;

      const file = files.file[0];
      const uploaded = await cloudinary.uploader.upload(file.filepath, { resource_type: "auto" });

      await axios.post(SCRIPT_URL, null, {
        params: {
          email: fields.email[0],
          name: fields.name[0],
          department: fields.department[0],
          year: fields.year[0],
          consent: fields.consent[0],
          workType: fields.workType[0],
          fileUrl: uploaded.secure_url
        }
      });

      res.json({ status: "success", fileUrl: uploaded.secure_url });

    } catch (e) {
      res.status(500).json({ status: "error", message: e.toString() });
    }
  });
}
