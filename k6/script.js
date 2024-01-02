import http from 'k6/http';
import { sleep } from 'k6';

const profiles = {
    normal: [
        { duration: '1m', target: 450 }, // traffic ramp-up
        { duration: '2m', target: 450 }, // steady load
        { duration: '1m', target: 900 }, // traffic ramp-up 
        { duration: '2m', target: 900 }, // peak hour
        { duration: '1m', target: 450 }, // traffic ramp-down 
        { duration: '2m', target: 450 }, // steady load
        { duration: '1m', target: 0 }, // ramp-down 
    ],
    high: [
        { duration: '1m', target: 500 }, // traffic ramp-up
        { duration: '2m', target: 500 }, // steady load
        { duration: '1m', target: 1500 }, // traffic ramp-up 
        { duration: '2m', target: 1500 }, // peak hour
        { duration: '1m', target: 500 }, // traffic ramp-down 
        { duration: '2m', target: 500 }, // steady load
        { duration: '1m', target: 0 }, // ramp-down 
    ],
    extreme: [
        { duration: '1m', target: 2000 }, // traffic ramp-up
        { duration: '2m', target: 2000 }, // steady load
        { duration: '1m', target: 4000 }, // traffic ramp-up 
        { duration: '2m', target: 4000 }, // peak hour
        { duration: '1m', target: 2000 }, // traffic ramp-down 
        { duration: '2m', target: 2000 }, // steady load
        { duration: '1m', target: 0 }, // ramp-down
    ],
}

const loadProfile = `${__ENV.LOAD_PROFILE}` ? profiles[`${__ENV.LOAD_PROFILE}`] : profiles.normal;
const host = `${__ENV.HOST}`;

export const options = {
    stages: loadProfile,
};

export default function () {
    let url;
    switch (host) {
        case 'frontend':
            url = 'http://192.168.122.117:3000/';
            break;
        default:
            url = 'http://192.168.122.117:8080/api/products';
    }
    http.get(url);
    sleep(1);
}
