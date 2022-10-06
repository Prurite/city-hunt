// Constants to test components without data from backends
export const
  taskList = [{
    "id": "1",
    "name": "SUSTech",
    "desc": "All points <strong>are</strong> in SUSTech",
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
      // These 6 above are merged from submissions at backend.
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
  }],
  submissions = [{
    id: "U12210101-P1-1",
    checkpoint: "1-1",
    user: "12210101",
    photo: "U12210101-P1-1.jpg",
    state: "pending",
    uploaded_time: "2022-10-06T18:43:05", // ISO format
  }, {
    id: "U12210101-P1-2",
    checkpoint: "1-2",
    user: "12210101",
    photo: "U12210101-P1-1.jpg",
    state: "accepted",
    uploaded_time: "",
    score: 6,
    bonus: 2
  }, {
    id: "U12210201-P1-2",
    checkpoint: "1-2",
    user: "12210201",
    photo: "U12210201-P1-1.jpg",
    state: "denied",
    uploaded_time: "",
    fail_reason: "不符合要求"
  }];