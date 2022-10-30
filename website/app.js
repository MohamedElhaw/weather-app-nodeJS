/* Global Variables */
const apiURL='https://api.openweathermap.org/data/2.5/weather?q=' //URL for weather API
const apiKey='&appid=b8c88e3416e4d3d346d00cedd63c0c98'; //API key
const dateElement=document.getElementById('date'); //pass date Element to const variable
const tempElement=document.getElementById('temp');//pass temp Element to const variable
const feelingElement =document.getElementById('feelings');// Save feeling Element to const variable
const feelingEntryElement= document.getElementById('feeling-entry'); //Save feeling-Entry Element to const variable
const cityNameElement =document.getElementById('cityName'); //Get the city name element
const ivalidElement= document.getElementById("invalidText"); // Get the ivalid text element

// Event listener to add function to existing HTML DOM element
document.getElementById('generate-btn').addEventListener('click', btnAction);

/* Generate button Action function */
function btnAction(){
    generateAction(cityNameElement.value); //generate button action function
}

/* Generate action function */
const generateAction =async cityName=>{
  const feeling= document.getElementById('feelings').value; //get the user feeling input of the user and save at variable:
  //Full URL for cairo city https://api.openweathermap.org/data/2.5/weather?q=Cairo,EG&units=metric&appid=b8c88e3416e4d3d346d00cedd63c0c98
   const fetchURL=apiURL+cityName+",EG&units=metric"+apiKey;
  // Create a new date instance dynamically with JS
   const d = new Date();
   const date = d.getDate()+'/'+(d.getMonth()+1)+'/'+ d.getFullYear();
  /* 1. Get Temp from API
     2. Post the date, temp, feeling to the server
     3. Update UI */
   const temp= await getTemp(fetchURL);
    if (temp!=='undefiend'){
      await postData('/addProjectData', {date, temp, feeling});//POST the data to our server
      updateUI();//Update UI elements
    }
} 

/* getTemp function */
  const getTemp= async URL=>{
    const res= await fetch(URL)
    try {
      const apiData = await res.json();
      console.log("apiData",apiData);
      if (apiData.cod!==200){
        invalidTextUpdate(apiData.message); //update the invalid text
        resetUI(); //resetUI
        return 'undefiend';
      }
      else if(apiData.cod===200){
       return apiData.main.temp; //return the temp from the API
      }
    } catch(error){
      console.log('The error',error); //log the error
    }
  }

/* postData function */
const postData= async (url='', uiData={}) =>{
  const res= await fetch(url,{
    method:'POST',
    credentials: 'same-origin',
    headers: {
      'content-Type':'application/json',
    },
    body:JSON.stringify(uiData),
  });
  try {
    const serverMessage =await res.json(); //wait the server message to receive 
    console.log(serverMessage);// log the message
  } catch (error) {
    console.log('The error', error); // //log the error
  }
}
/* updateUI function */
const updateUI=async() =>{
  const req = await fetch('/getProjectData');
  try {
    const serverData=await req.json(); //save the data received from the server at projectData
    console.log(serverData);
    /* Update UI elements */
    dateElement.innerHTML= `Date (D/M/Y): ${serverData.date}`;
    tempElement.innerHTML= `Temp: ${serverData.temp} c`;
    feelingEntryElement.innerHTML= serverData.feeling!==""? `Feeling: ${serverData.feeling}`:""; //update feeling only in case it was enetered by the user
  } catch (error) {
    console.log('The error', error); //log the error
  }
}

/* reset UI function */
const resetUI =()=>{
  dateElement.innerHTML= ""; //empty date element
  tempElement.innerHTML= ""; //empty temp element
  feelingEntryElement.innerHTML=""; ////empty feeling element
}
/** Feeling Elemeny listener to events focus and focus*/
feelingElement.addEventListener('focus', ()=>feelingElement.placeholder='')
feelingElement.addEventListener('focusout', ()=>{
  if (feelingElement.value===''){
    feelingElement.placeholder='Enter your feelings here';
  }
})
/** Listener to reset feeling element if the city is changed*/
cityNameElement.addEventListener('change', ()=> {
  feelingElement.value='';
  feelingElement.placeholder='Enter your feelings here';
})

    


  