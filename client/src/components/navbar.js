import { render } from '@testing-library/react'
import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'
import '../App.css' 

const Navbar = () => {

    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    
    const renderList = () => {

        if(!state) return null;

        if(state){
            return [
            <div>
                <li className = "lg-nav-display"><Link to="/profile">Profile</Link></li>,
                <li className = "lg-nav-display"><Link to="/createpost">Create Post</Link></li>,
                <li className = "lg-nav-display"><Link to="/myfollowingpost">Friend Posts</Link></li>,
                <li className = "lg-nav-display">
                    <button onClick = {()=> {
                        localStorage.clear() 
                        dispatch({type:"CLEAR"})
                        history.push('/signin')
                        } 
                        } 
                        >
                        Logout
                    </button>
                </li>

            </div>

            ]
        } else {
            return [
            <li><Link to="/signin">Login</Link></li>,
            <li><Link to="/signup">Sign Up</Link></li>
            ]
        }
    }

    return(
        <div>
            <ul className="nav">
                { renderList() }
            </ul>
        </div>
    )
}

export default Navbar 