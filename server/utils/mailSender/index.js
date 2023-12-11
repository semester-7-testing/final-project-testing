import nodemailer from "nodemailer";

export const sendMail = (mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export const getMailOptions = (receivers, orderNumber, orderAddress) => {
  if (!receivers) throw new Error("Receivers are required");
  if (!orderNumber) throw new Error("Order number is required");
  if (!orderAddress) throw new Error("Order address is required");

  return {
    from: "KEA Foot Shop", // sender address
    to: receivers, // list of receivers seperated by comma
    subject: `Your order ${orderNumber}`, // Subject line
    html: generateTemplate(orderNumber, orderAddress), // html body
  };
};

const generateTemplate = (orderNumber, orderAddress) => {
  return `
    <h2>Thank you for your order</h2>
    <p>
        Your order ${orderNumber} is now being processed. You will receive email, when order will
        be on the way to you to ${orderAddress}. 
    </p>
    `;
};
