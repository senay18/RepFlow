import './app.css'
import React, {useState, useEffect} from "react";

export default function Body(){
    
    const myAPI = "https://football-standings-api.vercel.app/leagues"

    const[leagues, setLeagues] = useState([]);
    // const[loading, setLoading] = useState(true);

    useEffect(() =>{
        const fetchData = async () =>{
        const response = await fetch(myAPI);
        const data = await response.json();
        setLeagues(data.data);
        console.log(data);
        }
        fetchData();
        },[])

// const ingredientsListItems = props.ingredients.map((ingredient) => (
//     <li key={ingredient}>{ingredient}</li>
//   ));

    const leagueListItems = leagues.map((leagues) => (
        <li key = {leagues.id}>{leagues.name}</li>
    ));


    return(
        <ul>{leagueListItems}</ul>
    )
}