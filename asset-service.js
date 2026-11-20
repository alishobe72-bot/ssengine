// SS ENGINE - IMAGE AND 3D ASSET SERVICE

const IMAGE_API_URL = process.env.IMAGE_API_URL;
const IMAGE_API_KEY = process.env.IMAGE_API_KEY;

const MODEL_3D_API_URL = process.env.MODEL_3D_API_URL;
const MODEL_3D_API_KEY = process.env.MODEL_3D_API_KEY;

async function createImage(prompt) {
  if (!IMAGE_API_URL || !IMAGE_API_KEY) {
    throw new Error("Image API is not configured");
  }

  if (!prompt || typeof prompt !== "string") {
    throw new Error("Valid image prompt is required");
  }

  const response = await fetch(IMAGE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${IMAGE_API_KEY}`
    },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    throw new Error("Image generation failed");
  }

  return response.json();
}

async function create3DModel(prompt) {
  if (!MODEL_3D_API_URL || !MODEL_3D_API_KEY) {
    throw new Error("3D Model API is not configured");
  }

  if (!prompt || typeof prompt !== "string") {
    throw new Error("Valid 3D model prompt is required");
  }

  const response = await fetch(MODEL_3D_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${MODEL_3D_API_KEY}`
    },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    throw new Error("3D model generation failed");
  }

  return response.json();
}

module.exports = {
  createImage,
  create3DModel
};
