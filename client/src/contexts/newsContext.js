import React, { useState, createContext, useEffect } from 'react';
import axios from 'axios'

export const NewsContext = createContext();

const NewsContextProvider = (props) => {

    const [ data, setData ] = useState(); 

    useEffect( async () => {
        await axios.get('https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=AKI3mAZGgGAxqzRJKfKViB2ESOMEQMQs')
        .then(response => {
            console.log(response.data.results)
            setData(response.data.results)
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