import React, {useState, useEffect} from "react"
import axios from "axios";

const baseUrl = "http://localhost:5000/";

const ShotChart = () => {
    const [inputValue, setInputValue] = useState('')
    const [newGraph, setNewGraph] = useState(false);
    const [isloading, setIsLoading] = useState(false); 
    const [exist, setExist] = useState('');

    const handleChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${baseUrl}/graph`, {
                name: inputValue
            });
            setNewGraph(response.data);
            setIsLoading(false); 
            setExist(''); 
        }catch (error) {
            console.log(error)
            setNewGraph(false); 
            setExist("Player does not exist"); 
            setIsLoading(false); 
        }
    }

    return ( 
        <div>
            <section className = "justify-content-center align-items-center">
            <div className="display-5 text-muted text-center my-3">
                Type in a Player's Name to see their ShotChart
            </div>
            <p className="lead text-center">Using matplotlib and seaborn, see any Player's ShotChart</p>
            </section>
            <section className = "text-center">
            <input
                onChange = {handleChange}
                type ="text"
                placeholder = "Player Name"
                value = {inputValue}
                />
            <button className = "text-center btn btn-primary m-3" 
            onClick = {event => {
                handleSubmit();
                setIsLoading(true); 
                setExist(''); 
                }} >Submit</button>
            <div>
            {!isloading ? <div>
            {newGraph.fg && <h3>{newGraph.fg}</h3>}
            {newGraph.plot && <img src={`data:image/png;base64,${newGraph.plot}`} alt="Matplotlib Graph" />}
            </div>: <h1>Loading...</h1>}
            </div>
            <div>
                <h1>{exist}</h1>
            </div>
            </section>
        </div>
     );
}
 
export default ShotChart;