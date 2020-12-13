import React, { useState, useContext } from 'react'
import { Link , useHistory } from "react-router-dom"
import { UserContext } from "../../App"
import M from "materialize-css"
import Spinner from 'react-bootstrap/Spinner';
import Toast from 'react-bootstrap/Toast';  

const Signin = () => {

    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ spinner, setSpinner ] = useState(false)
    const [ errorToast, setErrorToast ] = useState(false)

    const postData = (e) => {
        e.preventDefault()
        setSpinner(true)
        fetch("/signin", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email,
                password:password
            })
        }).then(res => res.json())
        .then(data=>{
            if(data.error){
                setSpinner(false)
                M.toast({html: "Invalid email or password!", classes: "red"})
                setErrorToast(true)
            } else {
                console.log(data)
                setSpinner(false)
                localStorage.setItem("jwt", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch({type:"USER", payload: data.user})
                M.toast({html: "Success!", classes: "green"})
                history.push("/") 
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }
    


    return (
            <div className="feed">
                <div classname="sign-in-wrap">
                    <div className="sign-in-img-wrap">
                        <img src="https://www.muraldecal.com/en/img/as366-jpg/folder/products-listado-merchanthover/wall-stickers-banksy-nyc-gangster-rat.jpg"/>
                    </div>
                    <h1 className="core-ultra text-center">Core Ultra</h1>
                    <form className="sign-in-form-wrap">
                        <input type = "text" placeholder = "email" name= "email" value = {email} onChange = {(e) => setEmail(e.target.value)}/>
                        <input type = "password" placeholder = "password" name = "password" value = {password} onChange = {(e)=>setPassword(e.target.value)}/>
                        <button className = 'sign-in-submit' onClick = {postData}>
                            Login
                        </button>
                        <p className = 'account'>Don't have an account? sign up <Link to = "/signup" className = "strong">here!</Link></p>
                        { spinner ? <div style = {{width:'100%', display:'flex', justifyContent:'center'}}><Spinner className = 'text-center' style = {{marginTop:'15px'}} animation="grow" /></div> : null }

                        <Toast style = {{background:'#d9252e', justifySelf:"center", margin:'0', padding:'0', color:'white', fontSize:'14px', height:'40px'}} onClose={() => setErrorToast(false)} show={errorToast} delay={2000} autohide>
                        <Toast.Body>Submit all fields</Toast.Body>
                        </Toast>
                    </form>
                </div>
            </div>
    )
}

export default Signin