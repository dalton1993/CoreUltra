import React, { useState, useEfect, useContext } from 'react';
import Modal from 'react-modal'
import { UserContext } from '../App'
import { Link, useHistory } from 'react-router-dom'

const MinNav = () => {

    const [ modal, setModal ] = useState(false)
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()

    if(!state) return null

    return(
        <div className="hamburger d-xl-none">
            <svg className="hamburger-icon" onClick = {()=>{
                setModal(true)}}
                width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-list" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
            </svg>


            <Modal className = "hamburger-modal" isOpen = { modal } onRequestClose = {()=> setModal(false)}>

                <div className = "modal-close" style={{textAlign:"end", marginRight:"10px"}} onClick={() => setModal(false)}>
                    <svg width="2rem" height="2rem" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </div>

                <div className = 'pic-wrap'>
                    <img className="sidebar-pic" src = {state?state.image:<p>loading!</p>}/>
                    <p className = "followers-handle">{ state?state.followers.length:<p>loading! </p> } followers</p>
                    <p className = "followers-handle">{ state?state.following.length:<p>loading! </p> } following</p>
                    <button className = "user-pic-btn"
                    onClick = {()=>{
                        setModal(true) 
                        }}
                    >Change User Photo</button>
                </div>

                <ul>
                    <li onClick={() => setModal(false)}><Link to="/"><i class="fas fa-home"/>All Posts</Link></li>
                    <li onClick={() => setModal(false)}><Link to="/profile"><i class="fas fa-user"/>My Posts</Link></li>
                    <li onClick={() => setModal(false)}><Link to="/createpost"><i class="fas fa-plus-circle"/>Create Post</Link></li>
                    <li onClick={() => setModal(false)}><Link to="/myfollowingpost"><i class="fas fa-user-friends"/>Following</Link></li>
                    <li onClick={() => setModal(false)} className="inline"><i class="fas fa-sign-out-alt"></i>
                        <p  className = "logout" onClick = {()=> {
                        localStorage.clear() 
                        dispatch({type:"CLEAR"})
                        history.push('/signin')
                        } 
                        } 
                    >
                    Logout
                </p>
            </li>
                </ul>

            </Modal>
        </div>
    )
}

export default MinNav 