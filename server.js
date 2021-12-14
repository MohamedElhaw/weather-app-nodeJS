// Setup empty JS object to act as endpoint for all routes
projectData = {};
//Identify server port
const port=process.env.PORT||6060;
// Require Express to run server and routes
const express = require ('express');
// Start up an instance of app
const app=express();
/*Dependencies*/
const bodyParser= require ('body-parser');
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require ('cors');
app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const server=app.listen(port, ()=>{
console.log(`The server is running on localhost:${port}`);// log message to the server when run
})

/* POST route */
app.post('/addProjectData', (req,res)=>{
console.log("Request Data",req.body); //log the request
/* Saving the request data to the projectData object */
projectData = {
  date:req.body.date,
  temp:req.body.temp,
  feeling:req.body.feeling
  }
console.log("Project Data",projectData); //log the data
const serverMessage ={message:"The data is successfully posted to the server", status:"200"}; //make server message to the client
res.send(serverMessage); // send the message to the client
})

/* updateUI get route */
app.get('/getProjectData', (req,res)=>{
  res.send(projectData);
})
