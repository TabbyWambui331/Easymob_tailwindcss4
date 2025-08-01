import emailjs from "emailjs-com";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendEmailWithSummary = async (summary) => {
  const templateParams = {
    summary,
    to_email: "youremail@example.com", // optional if your template uses fixed email
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    return "Email sent successfully!";
  } catch (error) {
    console.error("Email error:", error);
    return "Failed to send email.";
  }
};
