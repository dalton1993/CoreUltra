import React, { useContext } from 'react'
import { UserContext } from '../App'

const UserTag = () => {

    const { state, dispatch } = useContext(UserContext)
    console.log(state)

    if(!state) return null

    return(
        <div className = "user-tag d-flex align-items-center" style = {{color:'white', width:'100%'}}>
            <h1 className = 'd-flex align-items-center'>{state?state.name:"loading"}</h1>

        <div style = {{width:'100%'}} className = 'd-flex justify-content-end'>
            <svg style = {{marginRight:'15px'}} width="2rem" height="2rem" viewBox="0 0 16 16" class="bi bi-bell-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
            </svg>

            <svg width="2rem" height="2rem" viewBox="0 0 16 16" class="bi bi-envelope-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"/>
            </svg>
        </div>
        </div>
    )
}

export default UserTag