import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-modal';


const SubUserPost = () => {

    const [ data, setData ] = useState([])
    const [ comment, setComment ] = useState('')
    const [ modalComment, setModalComment ] = useState('');
    const [ itemId, setItemId ] = useState(''); 
    const { state, dispatch } = useContext(UserContext)

    useEffect( () => {
        fetch("/getsubpost", {
            headers:{
                "Authorization":"Bearer " + localStorage.getItem("jwt") 
            }
        }).then(res => res.json())
        .then( result => {
            console.log(result)
            setData(result.posts)
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

    const makeComment = (text, postId) => {
        if(text.length > 0 && postId){
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
                                        <>
                                        <h6 style = {{marginBottom:'0'}} key={record._id}>{record.postedBy.name}</h6>
                                        <p style={{marginTop:'0'}}>{record.text}</p>
                                        </>
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
                                type = 'submit'>Submit comment
                                </button>
                            </div>
                               
                        </div>

                    </div>
                        
                    )   
                })  
            : <Spinner style = {{marginTop:'20rem'}} animation="grow" /> }

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


export default SubUserPost