import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import { Link } from 'react-router-dom';

const MainSearch = () => {

    const [ search, setSearch ] = useState('');
    const [ input, setInput ] = useState('');
    const [ modal, setModal ] = useState('inactive');
    const [ user, setUser ] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    
    useEffect( ()=> {
        setModal('inactive')
    },[state])

    const fetchUsers = (query) => {
        setSearch(query)
        fetch('/search-users', {
            method:'post',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({query})
        })
        .then(res => res.json())
        .then(results => {
            setUser(results.user)
        })
    }

   
    if(!state) {
        return null
    }

    return(
    <div className="main-search">
        <input onChange = {(e) => {
            setModal('active')
            setInput(e.target.value)
            fetchUsers(input)

            if(e.target.value < 1){
                setModal('inactive')
            }

        }} placeholder="Search User" value = {input}/>

        
        <div className={modal}>
            <ul className = 'srch-box-style' style = {{width:'100%', padding:'15px', overflow:'scroll'}}>
                { user ? 
                 user.map(person => {
                    return(
                    <Link onClick = { () => {
                        setModal('inactive')
                        setInput('')
                    }
                        } className = 'srch-results' to = {"/profile/" + person._id }>
                        <li>
                            {person.name}
                        </li>
                    </Link>
                    )
                })
            : null}
            </ul>  
        </div>
        
    </div>
    )
}

export default MainSearch