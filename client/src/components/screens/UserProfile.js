import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from "../../App";
import { useParams, Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { Row, Col, Container } from 'react-bootstrap';
import Modal from 'react-modal';

const UserProfile = () => {

    const [ profile, setProfile ] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    const [ comment, setComment ] = useState('');
    const [ data, setData ] = useState([])
    const [ itemId, setItemId ] = useState('')
    const [ modalComment, setModalComment ] = useState(false)
    //const [ showFollow, setShowFollow ] = useState(state?!state.following.includes(userid):true)
    const [ showFollow, setShowFollow ] = useState(null)


    const loadData = async () => {
        const response = await fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
        const data = await response.json()
            setProfile(data)
            setData(data.posts)
            setShowFollow(state?!state.following.includes(userid):true)
    }
    
    useEffect(()=> { 
        loadData()
    },[userid])

    const followUser = () => {
         fetch("/follow", {
             method: "PUT",
             headers: {
                 "Content-Type": "application/json",
                 "Authorization": "Bearer " + localStorage.getItem("jwt")
             },
             body: JSON.stringify({
                 followId: userid
             })
         }).then(res=>res.json())
         .then(data=>{
            console.log(data)
            dispatch({ type:"UPDATE", payload: { following:data.following, followers:data.followers }})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setShowFollow(false)
         })
    }

    const unFollowUser = () => {
        fetch("/unfollow", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res=>res.json())
        .then(data=>{
           console.log(data)
           dispatch({ type:"UPDATE", payload: { following:data.following, followers:data.followers }})
           localStorage.setItem("user",JSON.stringify(data))
           setProfile((prevState)=>{
            const newFollower = prevState.user.followers.filter(item=>item != data._id)
               return {
                   ...prevState,
                   user:{
                       ...prevState.user,
                       followers:newFollower
                   }
               }
           })
           setShowFollow(true)
        })
   }

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

    return (
        <div className = 'd-flex flex-column align-items-center' style = {{maxWidth:'50rem'}}>
        <div style = {{padding:'15px', width:'100%', marginBottom:'20px', marginTop:'6px', borderRadius:'10px',boxShadow:'2px 2px 7px rgb(100,100,100)'}}>
        {
        profile ? 
        <div>

            <div className = 'other-user-profile'>
               
                <Row>
                    <Col lg = {12}className = 'd-flex justify-content-center'>
                        <img
                            style = {{
                                borderRadius:'50%',
                                width:'10rem',
                                height:'10rem',
                                objectFit:'cover'
                            }}
                            src = { profile.user.image }
                        />
                    </Col>
                </Row>

                <Row>
                    <Col lg = {12} className = 'd-flex flex-column justify-content-center align-items-center add-button'>
                        <h4>{ profile.user.name }</h4>
                        { showFollow ?
                                <button onClick = {()=>followUser()}>
                                    follow
                                </button>
                                :
                                <button onClick = {()=>unFollowUser()}>
                                    unfollow
                                </button>
                        } 
                    </Col>
                </Row>

                <Row style = {{marginTop:'15px'}}>
                    <Col lg = {12} className = 'd-flex justify-content-around'>
                        <h6 className = 'user-info'>{ profile.posts.length } Posts</h6>
                        <h6 className = 'user-info'>{ profile.user.followers.length } followers</h6>
                        <h6 className = 'user-info'>{ profile.user.following.length } following</h6>
                    </Col>
                </Row>
               

            </div>
            
        </div>
        : <Spinner style = {{marginTop:'20rem'}} animation="grow" /> }
        </div>

        <div>
        { data ?
                data.map( (item) => {
                    return (
                    <div className = 'feed'>
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
        </div>
    )
}


export default UserProfile