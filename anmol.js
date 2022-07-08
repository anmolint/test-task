const express = require("express");
const app = express();
app.use(express.json());
// const { db } = require("./db/dbConfig");

const routeradmin = require("./routes/routeindex");
// app.use(
//   "/",
//   routeradmin.manageroute,
//   routeradmin.adminroute,
//   routeradmin.userroute
// );
app.post('/googlesheets',async(req,res)=>{
  const body = req.body
  console.log(body);
  res.status(200).send();
})
app.listen(8080, () => {
  console.log("server started at 8080");
});
