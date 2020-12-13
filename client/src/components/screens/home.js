import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import { NewsContext } from '../../contexts/newsContext.js';
import Spinner from 'react-bootstrap/Spinner';
import { AutoInit } from 'materialize-css';

Modal.setAppElement('#root')
const Home = () => {

    const [ modal, setModal ] = useState(false)
    const [ comment, setComment ] = useState('');
    const [ modalInfo, setModalInfo ] = useState([])
    const [ data, setData ] = useState([])
    const [ itemId, setItemId ] = useState('')
    const [ modalComment, setModalComment ] = useState(false)
    const { state, dispatch } = useContext(UserContext)
    

    useEffect( () => {
        fetch("/allposts", {
            headers:{
                "Authorization":"Bearer " + localStorage.getItem("jwt") 
            }
        }).then(res => res.json())
        .then( result => {
            console.log(result)
            setData(result.posts)
        }).catch(err => {
            console.log(err);
        })
    },[])

    const likePost = (id) => {
        fetch("/like", {
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId:id
            })
        }).then(res => res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const unlikePost = (id) => {
        fetch("/unlike", {
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId:id
            })
        }).then(res => res.json())
        .then(result=>{
            //console.log(result)
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const makeComment = (text, postId) => {
        if(text.length > 0 && postId) {
        fetch("/comment", {
            method: "PUT",
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: postId,
                text: text
            })
        }).then(res => res.json())
        .then(result => {
            console.log(result)
            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
        }
    }

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }

    const editPost = (e, title, body, postId) => {
        e.preventDefault()
        fetch(`/myposts/${postId}/edit`, {
            method: "PUT",
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ 
                title: title,
                body: body
            })
        }).then(res => res.json())
        .then(result => {
            console.log(result)
            window.location.reload()
        }).catch(err=>{
            console.log(err)
        })
    }

    console.log(data)

    return (

        <div className = "feed">
            { data.length > 0 ?
                data.map( (item) => {
                    return (
                    <div className = "card-wrap" key={item._id}>
                        <div className = "user-wrap">

                            <div className="card-user">
                                <Link to = {item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile" }><p>{ item.postedBy.name }</p></Link>
                            </div>

                            <div className = "delete-icon">
                                {item.postedBy._id == state._id && <p onClick = {()=>deletePost(item._id)}>delete</p>}
                            </div>

                            <div className = "edit-icon">
                                {item.postedBy._id == state._id && <p 
                                onClick = {()=>{
                                setModal(true)
                                setModalInfo(item) 
                                }}>edit</p>}
                            </div>
                        </div>
        
                        <div className = "image-wrap">
                            <img src = { item.image }/>
                        </div>
        
                        <div className ="content-wrap">
                            <div className = 'like-wrap'>
                                {item.likes.includes(state._id) ?
                                <div onClick = {()=>{unlikePost(item._id)}} className = "down-vote-icons" style ={{color:"red"}}><i class="far fa-arrow-alt-circle-down"/></div>
                                :
                                <div class="far fa-arrow-alt-circle-up" onClick = {()=>{likePost(item._id)}} className = "up-vote-icon" style ={{color:"green"}}><i class="far fa-arrow-alt-circle-up"/></div>
                                }
                                <h6>{ item.likes.length } Likes</h6>
                            </div>
                            <h4 className = "card-title">{ item.title }</h4>
                            <p className = "card-body">{ item.body }</p>

                            <div className = "comment-wrap">
                            {
                                item.comments.map(record=>{
                                    return(
                                        <div>
                                        <h5 style={{fontWeight:"500", marginBottom:'0'}}>{record.postedBy.name}</h5>
                                        <p style = {{marginTop:'0'}} key={record._id}>{record.text}</p>
                                        </div>
                                    )
                                })
                            }
                            </div>

                            
                             <div className = 'w-100 d-flex justify-content-center'>   
                                <button onClick = { (e) => {
                                    setModalComment(true)
                                    setItemId(item._id)
                                }
                                }
                                    style = {{
                                        background:'none',
                                        border:'none',
                                        cursor:'pointer',
                                        fontsize:'20px',
                                        color:'rgb(100,100,100)',
                                        outline:'none',
                                        marginBottom:'10px'

                                    }}
                                type = 'submit'>Add comment
                                </button>
                            </div>
                                
                        </div>

                    </div>
                        
                    )   
                })  
            : <Spinner style = {{marginTop:'20rem'}} animation="grow" /> }

                <Modal className = "edit-modal" isOpen = { modal } onRequestClose = {()=> setModal(false)}>
                    <h1 className = 'text-center' style = {{margin:'20px', padding:'0', fontFamily:'Playfair Display'}}>Edit Post</h1>
                                
                        <div onClick={() => setModal(false)}
                            style = {{position:'absolute',
                                    top:'2%',
                                    right:'2%',
                                    cursor:'pointer',
                                    fontFamily:'Raleway'
                                }}
                        >
                            Close
                        </div>

                        <div style = {{width:'100%'}} className = "modal-card-wrap d-flex flex-column justify-content-center">
                            <form onSubmit={(e)=>{
                                editPost(e, e.target[0].value, e.target[1].value, modalInfo._id)}}>
                                <div className = "modal-card-title d-flex justify-content-center">
                                    <textarea className = 'create-title-input'
                                    name = "title" 
                                    defaultValue = { modalInfo.title }
                                    style = {{
                                        width:'80%'
                                    }}
                                    />
                                </div>

                                <div className = "modal-card-body d-flex justify-content-center">
                                    <textarea className = 'create-body-input' name = "body" defaultValue = { modalInfo.body }
                                        style = {{
                                            width:'80%'
                                        }}
                                    />
                                </div>

                                <div style = {{width:'100%', marginBottom:'15px'}} className = 'd-flex justify-content-center'>
                                    <button style = {{backgroundColor:'white', border:'none', outline:'none'}}>
                                        <svg width="2rem" height="2rem" viewBox="0 0 16 16" class="bi bi-plus-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                        </svg>
                                    </button>
                                </div>

                            </form>    
                        </div>
                </Modal>

                <Modal className = "edit-modal" isOpen = { modalComment } onRequestClose = {()=> setModalComment(false)}>

                <h1 className = 'text-center' style = {{margin:'20px', padding:'0', fontFamily:'Playfair Display'}}>
                    Comment
                </h1>

                <form onSubmit={(e)=>{
                        e.preventDefault()
                        makeComment(comment, itemId)
                        setComment('')
                        setModalComment(false)
                        }}>

                    <div className = "modal-card-body d-flex justify-content-center">
                        <textarea onChange = {(e)=>setComment(e.target.value)} className = 'create-body-input' type = "text" placeholder = "add comment" value = {comment}></textarea>
                    </div>

                    <div className = 'd-flex justify-content-center'>
                        <button className = 'comment-button' type = 'submite'>Submit</button>
                    </div>
                </form>

                </Modal>

        </div>
    )
}


export default Home 