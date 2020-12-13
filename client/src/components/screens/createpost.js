import React, {useState, useEffect} from "react"; 
import { useHistory } from "react-router-dom";
import Toast from 'react-bootstrap/Toast';
import Spinner from 'react-bootstrap/Spinner';
import '../../App.css'; 



const CreatePost = () => {

const history = useHistory()

const [ title, setTitle ] = useState("")
const [show, setShow] = useState(false);
const [ spinner, setSpinner ] = useState(false);
const [errorShow, setErrorShow] = useState(false);
const [ body, setBody ] = useState("")
const [ url, setUrl ] = useState("")
const [ image, setImage ] = useState("")

useEffect( () => {
    if(url){
    fetch("/createpost", {
        method: "POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer " + localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            title:title,
            body:body,
            image:url
        })
    }).then(res=> res.json())
    .then(data=>{
        console.log(data)
        if(data.error){
            setSpinner(false)
            alert('wrong!')
        } else {
            setSpinner(false)
            history.push("/")
        }
    })
    .catch(err=>{
        setErrorShow(true)
        console.log(err)
    })
}
}, [url])

const postData = (e) => {
    e.preventDefault()
    setSpinner(true)
    const data = new FormData()
    data.append("file",image)
    data.append("upload_preset", "insta-clone")
    data.append("cloud_name", "dgccfh9zu")
    console.log(data)
    fetch("https://api.cloudinary.com/v1_1/dgccfh9zu/image/upload", {
        method:"POST",
        body:data
    })
    .then(res => res.json())
    .then(data=>{
        setUrl(data.url)
        if(data.error){
            setSpinner(false)
            setErrorShow(true)
        }
    })
    .catch(err => {
        console.log(err)
    })  
}
     
    return(
       
        <div className="create-post-form">

            <form>
                <h1>Create Post</h1>
                <textarea className="create-title-input" type = "text" placeholder = "title" value = {title} onChange = {(e) => setTitle(e.target.value)}/>
                <textarea className="create-body-input" type = "text" placeholder = "body" value = {body} onChange = {(e) => setBody(e.target.value)}/>
                <div className = "create-img-upload">
                    <span>Upload Image</span>
                    <input type="file" onChange = {(e) => setImage(e.target.files[0])}/>
                </div>
                <div className="create-post-submit">
                    <svg onClick = {postData} width="2rem" height="2rem" viewBox="0 0 16 16" class="bi bi-plus-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                    { spinner ? <Spinner style = {{marginTop:'15px'}} animation="grow" /> : null }  
                </div>
                <div style = {{width:'100%', marginTop:'10px'}} className = "d-flex justify-content-center">
                    <Toast  style = {{background:'#d9252e', margin:'10px', padding:'0', color:'white', fontSize:'14px', height:'40px'}} onClose={() => setErrorShow(false)} show={errorShow} delay={2000} autohide>
                        <Toast.Body>Submit all fields</Toast.Body>
                    </Toast>
                </div>
            </form>
        
        </div>
    
    )
}

export default CreatePost