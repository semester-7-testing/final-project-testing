import { defineConfig } from "cypress";
import { connect, disconnect } from "./cypress/support/db.js";
import { USERS } from "./constants.js";
import {
  getLastEmail,
  deleteAllEmails,
} from "./cypress/plugins/email-inbox.js";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    defaultCommandTimeout: 6000,
    viewportWidth: 1600,
    viewportHeight: 800,
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      on("task", {
        async clearDB() {
          const db = await connect();
          const users = db.collection("users");
          await users.deleteOne({ email: "test123@example.com" });
          await disconnect();
          return null;
        },
        async seedDb() {
          const db = await connect();
          const ordersModel = db.collection("orders");
          const userModel = db.collection("users");
          const productModel = db.collection("products");

          const product = await productModel.findOne();

          const user = await userModel.findOne({
            email: USERS.commonUser.email,
          });

          console.log("userId", user);
          const userId = user._id.toString();
          let productId = product._id;

          const order = {
            userId: userId,
            products: [
              {
                productId: productId,
                quantity: 2,
              },
            ],
            deliveryAddress: "testAddress",
            status: "testStatus",
            email: USERS.commonUser.email,
          };

          await ordersModel.insertOne(order);
          await disconnect();
          return null;
        },
        async "inbox:getLastEmail"({ inboxUser, inboxPassword }) {
          return await getLastEmail(inboxUser, inboxPassword);
        },
        async "inbox:deleteAllEmails"({ inboxUser, inboxPassword }) {
          return await deleteAllEmails(inboxUser, inboxPassword);
        },
      });
    },
  },
  watchForFileChanges: false,
});
