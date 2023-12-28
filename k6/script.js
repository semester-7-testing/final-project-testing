import http from 'k6/http';
import { sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
    stages: [
        { duration: '1m', target: 100 }, // traffic ramp-up from 1 to 100 users over 1 minute.
        { duration: '5m', target: 100 }, // stay at 100 users for 5 minutes
        { duration: '1m', target: 200 }, // traffic ramp-up from 100 to 200 users over 1 minute (peak hour starts)
        { duration: '5m', target: 200 }, // stay at 200 users for 5 minutes
        { duration: '1m', target: 100 }, // traffic ramp-down from 200 to 100 users over 1 minute (peak hour ends)
        { duration: '5m', target: 100 }, // stay at 100 users for 5 minutes
        { duration: '1s', target: 0 }, // ramp-down to 0 users
      ],
};

export default function () {
  http.get('https://kea-foot-shop.onrender.com/');
  sleep(1);
}

export function handleSummary(data) {
    return {
      "/output/summary.html": htmlReport(data),
    };
  }