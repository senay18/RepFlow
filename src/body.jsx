import './app.css'
import React, {useState, useEffect} from "react";

export default function Body(){
    
    const myAPI = "https://www.thesportsdb.com/api/v1/json/3/all_leagues.php"


    const[leagues, setLeagues] = useState([]);
    // const[loading, setLoading] = useState(true);

    useEffect(() =>{
        const fetchData = async () =>{
        const response = await fetch(myAPI);
        const data = await response.json();
        const soccerLeagues = data.leagues.filter(l => l.strSport === "Soccer");

        setLeagues(soccerLeagues);
        console.log(soccerLeagues);
        }
        fetchData();
        },[])


    const leagueListItems = leagues.map((leagues) => (
        <li key = {leagues.strLeague}>{leagues.strLeague}</li>
    ));

    return (
  
      <section>
         <ul>{leagueListItems}</ul>
      </section>
    )
}