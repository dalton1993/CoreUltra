import React, { useContext } from 'react'
import { NewsContext } from '../contexts/newsContext.js'
import { UserContext } from '../App'

const NewsFeed = () => {

    const { data } = useContext(NewsContext)
    const { state, dispatch } = useContext(UserContext)

    if(!state) return null
     

    return(
        <div className = "sideBarRight">
           {data?data.map((news) => {
               return(
                   
                       <div className = "feed-card" alt = "No Photo">
                            <a className = "feed-link" href={news.url}>
                                {console.log(news['media'].map(item => item['media-metadata'][0]['url']))}
                                <div className = "feed-image-wrap"><img src={news['media'].map(item => item['media-metadata'][2]['url'])} alt="no photo available"/></div>
                                <div className = "feed-title">{ news.title}</div>
                                <div className = "feed-description">{news.abstract}</div>
                            </a>
                        </div>
                   
               )
           }) : "Loading" }
        </div>
    )
}

export default NewsFeed 