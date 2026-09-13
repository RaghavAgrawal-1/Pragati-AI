import { env } from "../config/env";

export const visionService = {
  analyze: async (referenceImage, currentImage) => {
    const formData = new FormData();

    formData.append("reference_image", referenceImage);
    formData.append("current_image", currentImage);

    const response = await fetch(
      `${env.apiBaseUrl}/api/vision/analyze`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Vision analysis failed");
    }

    return response.json();
  },
};