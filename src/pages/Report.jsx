import React, { useEffect, useState } from "react";
import { generateReport } from "../utils/ReportGenerator";
import { getInsights } from "../utils/AIInsights";
import emailjs from "@emailjs/browser";

const Reports = () => {
  const [report, setReport] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailStatus, setEmailStatus] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await generateReport();
        const aiInsights = getInsights(data);

        setReport(data);
        setInsights(aiInsights);
        setLoading(false);

        await sendReportEmail(data, aiInsights);
      } catch (error) {
        console.error("❌ Error generating or sending report:", error);
        setEmailStatus("❌ Failed to send email.");
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const sendReportEmail = async (data, aiInsights) => {
    const message = `
📊 Sales Report

🔹 Total Revenue: $${data.totalRevenue.toFixed(2)}
🔹 Top Product: ${data.topProduct[0]} (${data.topProduct[1]} sold)

🧠 AI Insights:
- ${aiInsights.message}
- ${aiInsights.restockAdvice}
- ${aiInsights.revenueComment}

📦 Items Sold:
${Object.entries(data.itemsSold)
  .map(([name, qty]) => `• ${name}: ${qty} sold`)
  .join("\n")}
`;

    try {
      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          user_email: "admin@example.com", // Change to your target email or make dynamic
          message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      console.log("✅ Email sent:", response.status, response.text);
      setEmailStatus("✅ Report sent via email.");
    } catch (err) {
      console.error("❌ Email send failed:", err);
      setEmailStatus("❌ Failed to send report via email.");
    }
  };

  if (loading) return <p className="text-center">Loading report...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sales Report</h1>

      {emailStatus && (
        <div className="mb-4 p-2 rounded text-sm font-medium text-white bg-blue-600">
          {emailStatus}
        </div>
      )}

      <div className="bg-white p-4 rounded shadow mb-4">
        <p><strong>Total Revenue:</strong> ${report.totalRevenue.toFixed(2)}</p>
        <p><strong>Top Product:</strong> {report.topProduct[0]} ({report.topProduct[1]} sold)</p>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">AI Insights</h2>
        <p>{insights.message}</p>
        <p>{insights.restockAdvice}</p>
        <p>{insights.revenueComment}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">All Items Sold</h2>
        <ul className="list-disc list-inside">
          {Object.entries(report.itemsSold).map(([name, qty]) => (
            <li key={name}>{name}: {qty} sold</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reports;
