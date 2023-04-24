import * as sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SEND_GRID_KEY || "");

export default async function sendEmail(
  to: string,
  subject: string,
  text: string,
  dynamicData: any,
  templateId: string,
) {
  const msg: sgMail.MailDataRequired = {
    to: to,
    from: process.env.SEND_GRID_SENDER || "",
    subject: subject,
    text: text,
    dynamicTemplateData: dynamicData,
    templateId: templateId,
  };
  console.log(msg);
  return await sgMail
    .send(msg)
    .then(() => true)
    .catch((e) => {
      console.log(e);
      return false;
    });
}
