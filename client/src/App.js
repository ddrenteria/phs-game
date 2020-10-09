import React, {useState, useEffect} from 'react';
import './App.css';
import { CSVLink } from "react-csv";
import Axios from "axios";

function timeConverter(UNIX_timestamp){
  const milliseconds = UNIX_timestamp /1000 ;
  const clear = milliseconds*1000;
  const dateObject = new Date(clear);
  return dateObject.toLocaleString(); //2019-12-9 10:30:15
}

function App() {
  const [timeLastUpdate, setTimeLastUpdate] = useState(0);
  const [topScoresList, setTopScoresList] = useState([]);
  
  useEffect(() => {
    Axios.get('http://localhost:3001/api/get').then((response) => {
        setTopScoresList(response.data);
        // updateReport(response.data);
        console.log("data fetched")
    })
    const interval = setInterval(() => {
      console.log("getting data pi pi pu pu");
      Axios.get('http://localhost:3001/api/get').then((response) => {
        setTopScoresList(response.data);
        console.log("data fetched")
      })
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1> Top Scores of PHs-Game </h1>
      {topScoresList.map((elem) => {
        return (
          <div>
            <img src={elem.profile_image}></img> User: {elem.nickname}
            <h6>
              <div className="score"> Score: {elem.value} </div> 
              Generated time: {timeConverter(elem.timestamp)}
            </h6>

          </div>
        );
      })}
      <CSVLink data={topScoresList} >Download report</CSVLink>
    </div>
  );
}

export default App;
