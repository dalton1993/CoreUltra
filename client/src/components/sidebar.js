import React, { useContext, useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Modal from 'react-modal'
import { UserContext } from '../App'


const Sidebar = () => {

    const [ image, setImage ] = useState("")
    const { state, dispatch } = useContext(UserContext)
    const [ modal, setModal ] = useState(false)
    const [ modalInfo, setModalInfo ] = useState([])
    const history = useHistory()


    useEffect(()=>{
        if(image){
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "dgccfh9zu")
        fetch("https://api.cloudinary.com/v1_1/dgccfh9zu/image/upload", {
                method:"POST",
                body:data
            })
        .then(res => res.json())
        .then(data=>{
            // localStorage.setItem("user",JSON.stringify({...state, image: data.url}))
            // dispatch({type:"UPDATE_PIC", payload:data.url})
            fetch("/updateimage",{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer " + localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    image:data.url
                })
        }).then(res=>res.json())
        .then(result=>{
            localStorage.setItem("user",JSON.stringify({...state, image: result.image}))
            dispatch({type:"UPDATE_PIC", payload:result.image})
        })
        })
        .catch(err => {
            console.log(err)
        })
        }
    },[image])

    const updatePhoto = (file) => {
        setImage(file)
    }

    const renderList = () => {
        if(state){
            return [
            <li><i class="fas fa-home"></i><Link to="/">All Posts</Link></li>,
            <li><i class="fas fa-user"></i><Link to="/profile">My Posts</Link></li>,
            <li><i class="fas fa-user-friends"></i><Link to="/myfollowingpost">Following Posts</Link></li>,
            <li className="inline"><i class="fas fa-sign-out-alt"></i>
                <p  className = "logout" onClick = {()=> {
                    localStorage.clear() 
                    dispatch({type:"CLEAR"})
                    history.push('/signin')
                    } 
                    } 
                    >
                    Logout
                </p>
            </li>,
            <li><i class="fas fa-plus-circle"></i><Link to="/createpost" className="create-post">Create Post</Link></li>
            ]
        }
    }

    if(!state) return null

    return(
        <div className = "sidebar">
            <div className = 'pic-wrap'>
                <img style = {{objectFit:'cover'}} className="sidebar-pic" src = {state?state.image:<p>loading!</p>}/>
                <p className = "followers-handle">{ state?state.followers.length:<p>loading! </p> } followers</p>
                <p className = "followers-handle">{ state?state.following.length:<p>loading! </p> } following</p>
                <button className = "user-pic-btn" style = {{outline:'none'}}
                onClick = {()=>{
                    setModal(true) 
                    }}
                >Change User Photo</button>
            </div>
            <ul>
                { renderList() }
            </ul>

            <Modal isOpen = { modal } onRequestClose = {()=> setModal(false)} className = 'user-pic-modal d-flex justify-content-center align-items-center'>

                                
                        <div onClick={() => setModal(false)} className = 'user-pic-modal-close'>
                            Close
                        </div>

                        <form>
                            <input className="photo-upload" type="file" onChange = {(e) => {
                                updatePhoto(e.target.files[0])
                                setModal(false)
                                }
                                }>
                            </input>
                        </form>
            </Modal>
        </div>
    )
}


export default Sidebar