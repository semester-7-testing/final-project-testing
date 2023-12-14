import { connect } from "imap-simple";
import { simpleParser } from "mailparser";

const etherealBaseConfig = {
  host: "imap.ethereal.email",
  port: 993,
  tls: true,
  authTimeout: 10_000,
};

export const getLastEmail = async (inboxUser, inboxPassword) => {
  const connection = await connect({
    imap: {
      ...etherealBaseConfig,
      user: inboxUser,
      password: inboxPassword,
    },
  });

  await connection.openBox("INBOX");
  const searchCriteria = ["UNDELETED"];
  const fetchOptions = {
    bodies: [""],
  };
  const messages = await connection.search(searchCriteria, fetchOptions);
  connection.end();

  if (!messages.length) {
    return null; // important to return null so recurse funtion will retry this email logic until it returns an object
  }

  const mail = await simpleParser(messages[messages.length - 1].parts[0].body);

  return {
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  };
};

export const deleteAllEmails = async (inboxUser, inboxPassword) => {
  const connection = await connect({
    imap: {
      ...etherealBaseConfig,
      user: inboxUser,
      password: inboxPassword,
    },
  });

  await connection.openBox("INBOX");
  const searchCriteria = ["1:*"];
  const fetchOptions = {
    bodies: [""],
  };
  const messages = await connection.search(searchCriteria, fetchOptions);

  messages.forEach(async (message) => {
    await connection.deleteMessage(message.attributes.uid);
  });

  connection.end();

  return null; // Cypress requires to return null when using cy.task
};
