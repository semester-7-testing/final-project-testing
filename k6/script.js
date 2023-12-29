import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    // normal
    stages: [
        { duration: '1m', target: 500 }, // traffic ramp-up from 1 to 100 users over 1 minute.
        { duration: '2m', target: 500 }, // stay at 100 users for 5 minutes
        { duration: '1m', target: 1500 }, // traffic ramp-up from 100 to 200 users over 1 minute (peak hour starts)
        { duration: '2m', target: 1500 }, // stay at 200 users for 5 minutes
        { duration: '1m', target: 500 }, // traffic ramp-down from 200 to 100 users over 1 minute (peak hour ends)
        { duration: '2m', target: 500 }, // stay at 100 users for 5 minutes
        { duration: '1m', target: 0 }, // ramp-down to 0 users
      ],
    // extreme
    // stages: [
    //     { duration: '1m', target: 2000 }, // traffic ramp-up from 1 to 100 users over 1 minute.
    //     { duration: '2m', target: 2000 }, // stay at 100 users for 5 minutes
    //     { duration: '1m', target: 4000 }, // traffic ramp-up from 100 to 200 users over 1 minute (peak hour starts)
    //     { duration: '2m', target: 4000 }, // stay at 200 users for 5 minutes
    //     { duration: '1m', target: 2000 }, // traffic ramp-down from 200 to 100 users over 1 minute (peak hour ends)
    //     { duration: '2m', target: 2000 }, // stay at 100 users for 5 minutes
    //     { duration: '1m', target: 0 }, // ramp-down to 0 users
    //   ],
};

export default function () {
  // http.get('http://192.168.122.117:3000/');
  http.get('http://192.168.122.117:8080/api/products');
  sleep(1);
}
