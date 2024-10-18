import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function generateSummaryAndLearnings(transcript: string,videoDetails:any): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Given the following transcript from a YouTube video, please provide:
    1. A concise summary of the video (about 2-3 paragraphs around 300 to 500 words) (the audience should be pretty familiar with the host already so no need to introduce them can introduce the guest if someone is there).
    2. Key learnings or takeaways (3-5 bullet points).
    3. Any interesting quotes or memorable moments.

    during the writings make sure if the video is about the personal experience refer his name: ${videoDetails.channelTitle} to those places rather than calling him an individual. this should make the newsletter more familiar to the user.

   srtictly Format the entire output as an HTML newsletter section, with appropriate headings and styling. write nothing else on the output. Use the following HTML structure:

    <div class="newsletter-content">
      <h2>Video Summary</h2>
      <div class="summary">
        [Insert summary paragraphs here]
      </div>
      
      <h2>Key Takeaways</h2>
      <ul class="takeaways">
        [Insert bullet points here]
      </ul>
      
      <h2>Memorable Moments</h2>
      <div class="quotes">
        [Insert quotes or memorable moments here]
      </div>
    </div>

    Ensure proper HTML formatting, including <p> tags for paragraphs and <li> tags for list items.

    Transcript:
    ${transcript}
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const html = response.text();

  return html;
}