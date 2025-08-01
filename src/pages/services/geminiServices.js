const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL;

export const summarizeProducts = async (products) => {
  const productText = products.map(p => `${p.name}: sold ${p.sales}`).join("\n");

  const data = {
    contents: [
      {
        parts: [
          {
            text: `These are the sales data:\n${productText}\n\nSummarize which products are most popular and why they might be selling well.`
          }
        ]
      }
    ]
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  return result.candidates?.[0]?.content?.parts?.[0]?.text || "No summary returned.";
};
