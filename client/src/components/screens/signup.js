import React, { useState, useEffect } from 'react';
import {Link, useHistory} from "react-router-dom"; 
import axios from 'axios';
import M from 'materialize-css'; 
import Toast from 'react-bootstrap/Toast';

const Signup = () => {
    
    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [ image, setImage ] = useState("")
    const [ url, setUrl ] = useState("")
    const [ errorToast, setErrorToast ] = useState(false)

    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])

    const uploadPic = () => {
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
            setUrl(data.url)
            })
        .catch(err => {
        console.log(err)
        })
    }

    const uploadFields = () => {
        fetch('/signup', {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                name:name,
                password:password,
                email:email,
                image:url
            })
            }).then(res => res.json())
            .then(data =>{
                if(data.error){
                    setErrorToast(true)
                    console.log(data.error)
                }
                else{
                    console.log(data)
                    history.push('/signin')
                }
        })
    }

    const postData = (e) => {
        e.preventDefault(); 
        if(image){
            uploadPic()
        } else {
            uploadFields()
        }
    }

        return (
            <div className="feed" style  = {{marginTop:'1rem'}}>
                <div classname="sign-in-wrap">
                    <div className="sign-in-img-wrap">
                        <img src="https://www.muraldecal.com/en/img/as366-jpg/folder/products-listado-merchanthover/wall-stickers-banksy-nyc-gangster-rat.jpg"/>
                    </div>
                    <h1 className="core-ultra text-center">Core Ultra</h1>
                    <form className="sign-in-form-wrap">
                    <input type = "text" placeholder = "user name" name = "name" 
                        value = {name} onChange = {(e)=> setName(e.target.value)}
                    />


                    <input type = "text" placeholder = "email" name = "email"
                        value = {email} onChange = {(e)=>setEmail(e.target.value)}
                    />

                    <input type = "password" placeholder = "password" name="password"
                        value = {password} onChange = {(e)=>setPassword(e.target.value)}  
                    />

                    <div className = 'd-flex justify-content-center'>
                        <div className = "create-img-upload sign-in-pic d-flex flex-column align-items-center justify-content-center" style = {{padding:0, marginBottom:'0'}}>
                            <span className = 'text-center'>User Picture</span>
                            <input style = {{border:'none',width:'100%'}} type="file" onChange = {(e) => setImage(e.target.files[0])}/>
                        </div>
                    </div>

                        <Toast style = {{background:'#d9252e', justifySelf:"center", marginBottom:'10px', padding:'0', color:'white', fontSize:'14px', height:'40px'}} onClose={() => setErrorToast(false)} show={errorToast} delay={2000} autohide>
                        <Toast.Body>Submit all fields</Toast.Body>
                        </Toast>

                    <button className = 'sign-in-submit' onClick={postData} style = {{outline:'none'}}>
                        Sign Up!
                    </button>
                    <p className = 'account'>Already have an account? sign in <Link to = "/signin">here!</Link></p>
                    </form>
                </div>
                </div>
          
        )
}

export default Signup