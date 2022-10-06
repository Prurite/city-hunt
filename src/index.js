import React from 'react';
import ReactDOM from 'react-dom/client';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const axios = require('axios');

import { PageCheckpoints } from './pageCheckpoints';

const root = ReactDOM.createRoot(document.getElementById("root"));
// DEBUG
const checkpointList = [ {
    "id": "1",
    "name": "SUSTech",
    "desc": "All points are in SUSTech",
    "points": [{
      "id": "1-1",
      "name": "Lecture Hall 1",
      "scores": [6, 5, 4, 3],
      "desc": "Take a photo as given",
      "images": ["1-1-1.jpg", "1-1-2.jpg"],
      "passed": 0, // Users that has submitted an accepted answer
      "state": "accepted", // or "accepted", "denied", null
      "uploaded_time": "", // An ISO string describing time or null
      "photo": "U12210101-P1-1.jpg", // or null
      "score": "0(+2)", // or null
      "fail_reason": "" // or a string containing reason
      // Read these 6 above from submissions
    }, {
      "id": "1-2",
      "name": "Lecture Hall 2",
      "scores": [8, 7, 6, 5],
      "desc": "222",
      "images": ["1-2.jpg"],
      "passed": 5
    }]
  }, {
    "id": "2",
    "name": "Shenzhenbei Station",
    "desc": "In the station",
    "points": [{
      "id": "2-1",
      "name": "Station square",
      "scores": [6, 5, 4, 3],
      "desc": "square",
      "images": ["2-1jpg"],
      "passed": 1
    }]
  }];
root.render(<PageCheckpoints list={checkpointList} />);