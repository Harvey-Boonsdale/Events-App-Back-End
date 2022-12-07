const express = require("express");
const app = express();
const port = 3001;
const createError = require("http-errors");

let idno = 0;
let eventList = [];

app.use(express.json());

// Create an event

app.post("/events", (req, res) => {
  if (
    !req.body.name ||
    !req.body.location ||
    !req.body.info ||
    !req.body.date ||
    !req.body.time
  ) {
    return res.sendStatus(400);
  }
  eventList.push({ ...req.body, id: idno++ });
  res.send("Event Added!");
});

// Read list of events+

app.get("/events", (req, res) => {
  res.send(eventList);
  console.log(eventList);
});

// Update event

// app.put("/events./:id", (req, res) => {
//   const event = eventList.find((event) => event.id === Number(req.params.id));
// if (
//     !req.body.name ||
//     !req.body.location ||
//     !req.body.info ||
//     !req.body.date ||
//     !req.body.time
//   ) {
//     return res.sendStatus(400);
//   }
//   if (!event) {
//     return res.sendStatus(404);
//   }
//   eventList = eventList.map((event) => {
//     if(event.id === Number(req.params.id)); {
//         return {...
//     }
//     }
//   };
// });

// Delete event

app.delete("/events/:id", (req, res) => {
  const event = eventList.find((event) => event.id === Number(req.params.id));
  if (!event) {
    return res.sendStatus(404);
  }
  eventList = eventList.filter((event) => {
    return event.id !== Number(req.params.id);
  });
  res.send({ result: true });
});

app.listen(port, () => {
  console.log("server is live on port " + port);
});
