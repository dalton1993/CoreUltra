import React, { useContext } from 'react'
import { UserContext } from '../App'



const SideBarComponent = () => {

    const { state, dispatch } = useContext(UserContext)

    if(!state) return null

    return(
        <div className = "user-name" style = {{width:'100%', fontWeight:'500'}}>
            <h1 className = 'text-center'>Core Ultra</h1>
        </div>
    )
}

export default SideBarComponent