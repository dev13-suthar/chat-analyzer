import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" ,generationConfig:{
    responseMimeType:"application/json",
}});

export async function POST(request: NextRequest) {
    const content = await request.json();
    const prompt = `
         Analyze the following WhatsApp chat text. Perform the following:
        1. Group content into themes/topics.
        2. Detect recurring patterns and their frequency.
        3. Map relationships between themes or topics (e.g., sentiment, keywords).
        4. Provide a frequency analysis of the most mentioned words or names.
        5. Return the analysis as a well-structured JSON.

        Example JSON Response:
        {
            "themes": ["Productivity", "Motivation", "Design"],
            "patterns": [
                {"pattern": "User shares articles frequently", "frequency": 10},
                {"pattern": "Quotes about simplicity", "frequency": 5}
            ],
            "relationships": [
                {"theme1": "Motivation", "theme2": "Productivity", "link": "Positive quotes improve focus"}
            ],
            "frequencyAnalysis": {
                "mostMentionedWords": ["design", "simple", "user"],
                "topActions": ["sharing links", "journaling"]
            },
            "insights": "The chat reflects a user focused on self-improvement, productivity, and user-centric design."
        }
        also add any other important information that you want to include in the response and add in JSON key value pairs
        Chat text:
        ${content.content}
    `;
    const result = await model.generateContent(prompt);
    const plainText = result.response.text();
    try {
        return NextResponse.json({
            data:plainText
        })
    } catch (err) {
        return NextResponse.json({
            err
        })
    }
}

// function extractSection(text:any, sectionTitle:any) {
//     const regex = new RegExp(`\\*\\*${sectionTitle}:\\*\\*([\\s\\S]*?)(?=\\*\\*|$)`, "i");
//     const match = text.match(regex);
//     return match ? match[1].trim() : null;
// }