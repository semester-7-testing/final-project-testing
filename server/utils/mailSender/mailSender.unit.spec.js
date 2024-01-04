import nodemailer from "nodemailer";
import { getMailOptions, sendMail } from "./index";
describe("get mail options", () => {
  const receivers = "test@example.com";
  const orderNumber = "123123123";
  const orderAddress = "Test Street 1";

  it("should return mail options with order number in the template", () => {
    const result = getMailOptions(receivers, orderNumber, orderAddress);

    expect(result.html).toEqual(expect.stringContaining(orderNumber));
  });

  it("should return mail options with address in the template", () => {
    const result = getMailOptions(receivers, orderNumber, orderAddress);

    expect(result.html).toEqual(expect.stringContaining(orderAddress));
  });

  it("should return mail options with order number in the subject", () => {
    const result = getMailOptions(receivers, orderNumber, orderAddress);

    expect(result.subject).toEqual(expect.stringContaining(orderNumber));
  });

  it("should return mail options with receivers", () => {
    const result = getMailOptions(receivers, orderNumber, orderAddress);

    expect(result.to).toEqual(expect.stringContaining(receivers));
  });

  it("should return mail options with receivers", () => {
    const result = getMailOptions(receivers, orderNumber, orderAddress);

    expect(result.to).toEqual(expect.stringContaining(receivers));
  });

  it.each([
    [undefined, orderNumber, orderAddress],
    ["", orderNumber, orderAddress],
    [null, orderNumber, orderAddress],
    [0, orderNumber, orderAddress],
  ])(
    "should throw error if receivers are not provided",
    (receivers, orderNumber, orderAddress) => {
      expect(() =>
        getMailOptions(receivers, orderNumber, orderAddress)
      ).toThrow("Receivers are required");
    }
  );

  // stubs
  //parameterized test
  it.each([
    [receivers, undefined, orderAddress],
    [receivers, "", orderAddress],
    [receivers, null, orderAddress],
    [receivers, 0, orderAddress],
  ])(
    "should throw error if order number is not provided",
    (receivers, orderNumber, orderAddress) => {
      expect(() =>
        getMailOptions(receivers, orderNumber, orderAddress)
      ).toThrow("Order number is required");
    }
  );

  it.each([
    [receivers, orderNumber, undefined],
    [receivers, orderNumber, ""],
    [receivers, orderNumber, null],
    [receivers, orderNumber, 0],
  ])(
    "should throw error if order address is not provided",
    (receivers, orderNumber, orderAddress) => {
      expect(() =>
        getMailOptions(receivers, orderNumber, orderAddress)
      ).toThrow("Order address is required");
    }
  );
});

// mocking
jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockReturnValue((mailoptions, callback) => {}),
  }),
}));

describe("send mail", () => {
  it("should send an email with the correct mail options", () => {
    const mailOptions = {
      from: "test@example.com",
      to: "receiver@example.com",
      subject: "Test",
      html: "<h1>Test</h1>",
    };

    sendMail(mailOptions);

    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith(
      mailOptions,
      expect.any(Function)
    );
  });
});
