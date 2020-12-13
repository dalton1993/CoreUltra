import React, { useState, createContext, useEffect } from 'react';
import axios from 'axios'

export const NewsContext = createContext();

const NewsContextProvider = (props) => {

    const [ data, setData ] = useState(); 

    useEffect( async () => {
        await axios.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=01959f81b3c14ba5b299b91935266de8')
        .then(response =>{
            setData(response.data)
        })
        .catch(err=>{
            console.log(err)
        })
    },[])

    console.log(data)

    return(
        <div>
            <NewsContext.Provider value = {{ data }}>
                { props.children }
            </NewsContext.Provider>
        </div>
    )
}

export default NewsContextProvider