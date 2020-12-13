import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import { UserContext } from '../App';

export default function Following() {

    const { state, dispatch } = useContext(UserContext)
    const [following, setFollowing ] = useState([])
    
    useEffect( () => {
        axios.get('http://localhost:3000/get-following', {
            headers:{
                "Authorization":"Bearer " + localStorage.getItem("jwt") 
            }
        })
        .then(res => {
            setFollowing(res.data.following.following)
        })
    },[state])

    if(!state) return null

    return (
        <div  className = 'following-box'>
            { following.length > 0 ? following.map( person => {
                return(
                <ul style = {{margin:'3px', listStyleType:'none', padding:'0'}}>
                    <Link to = {"/profile/" + person._id} style = {{textDecoration:'none'}}>
                        <li className = 'following-list'>{person.name}</li>
                    </Link>
                </ul>
                )
            }) : null 
            }
        </div>
    )
}
