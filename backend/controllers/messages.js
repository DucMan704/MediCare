import { GoogleGenAI } from "@google/genai";
import axios from "axios";
/*
|--------------------------------------------------------------------------
| CONFIG
|--------------------------------------------------------------------------
*/

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

/*
|--------------------------------------------------------------------------
| SYSTEM PROMPT
|--------------------------------------------------------------------------
*/
const SYSTEM_PROMPT = `
You are an AI medical assistant for an online hospital appointment system.

Your responsibilities:
- Communicate politely and professionally with users.
- Ask users about their symptoms, including:
  - Main symptom
  - Duration
  - Severity
  - Location
  - Associated symptoms
  - Existing medical conditions
  - Current medications
- Ask follow-up questions whenever the available information is insufficient.
- Do NOT make a definitive medical diagnosis.
- After collecting enough information, provide:
  1. Possible medical conditions (not confirmed diagnoses).
  2. Recommended next steps.
  3. Whether the user should seek emergency care.
  4. Recommend the most appropriate doctor from the provided doctor list.
Doctor recommendation rules:
- Only recommend doctors from the provided doctor list.
- Match the doctor's specialty with the user's symptoms.
- If no suitable doctor exists, return doctor as null.
- Recommend only ONE doctor.

Safety rules:
- Never claim that the diagnosis is certain.
- Clearly state that your assessment is for informational purposes only.
- If symptoms suggest a medical emergency (such as severe chest pain, difficulty breathing, stroke symptoms, severe bleeding, or loss of consciousness), immediately advise the user to seek emergency medical care instead of continuing the conversation.

Always return ONLY valid JSON.

JSON format:

{
  "message": "Response shown to the user.",
  "diagnosis": [
    {
      "disease_name": "",
      "course_of_action": ""
    }
  ],
  "doctor": {
    "id": "",
    "name": "",
    "speciality": ""
  }
}
`;

/*
|--------------------------------------------------------------------------
| CLEAN JSON RESPONSE
|--------------------------------------------------------------------------
*/

const cleanJSON = (text) => {
  if (!text) {
    return {
      message: "",
      diagnosis: [],
      doctor: null,
    };
  }

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(text);
  } catch (error) {
    console.log("JSON ERROR:", text);

    return {
      message: text,

      diagnosis: [],
      doctor: null,
    };
  }
};

/*
|--------------------------------------------------------------------------
| SEARCH DIAGNOSIS
|--------------------------------------------------------------------------
*/

const handleDiagnosis = async (data) => {
  const diagnoses = data?.diagnosis || [];

  if (!diagnoses.length || !GOOGLE_API_KEY || !SEARCH_ENGINE_ID) {
    return diagnoses;
  }

  const results = await Promise.all(
    diagnoses.map(async (item) => {
      try {
        const response = await axios.get(
          "https://www.googleapis.com/customsearch/v1",

          {
            params: {
              key: GOOGLE_API_KEY,

              cx: SEARCH_ENGINE_ID,

              q: item.disease_name,
            },
          },
        );

        return {
          disease_name: item.disease_name,

          course_of_action: item.course_of_action,

          searchResult: response.data.items?.[0]?.link || "",
        };
      } catch (error) {
        return {
          disease_name: item.disease_name,

          course_of_action: item.course_of_action,

          searchResult: "",
        };
      }
    }),
  );

  return results;
};

/*
|--------------------------------------------------------------------------
| CREATE MESSAGE
|--------------------------------------------------------------------------
*/

export const createMessage = async (req, res) => {
  try {
    const { chats } = req.body;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,

        message: "Missing GEMINI_API_KEY",
      });
    }

    if (!Array.isArray(chats) || chats.length === 0) {
      return res.status(400).json({
        success: false,

        message: "Chats empty",
      });
    }

    const prompt = [
      {
        role: "system",

        content: SYSTEM_PROMPT,
      },

      ...chats,
    ];

    const contents = prompt

      .map((item) => `${item.role}: ${item.content}`)

      .join("\n");

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents,
    });

    const responseData = cleanJSON(result.text);

    const diagnosis = await handleDiagnosis(responseData);

    return res.status(200).json({
      response: {
        role: "assistant",

        content: JSON.stringify(responseData),
      },

      diagnosis,
    });
  } catch (error) {
    console.error("AI Error:", error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
