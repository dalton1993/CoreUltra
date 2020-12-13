import React, { useContext } from 'react'
import { NewsContext } from '../contexts/newsContext.js'
import { UserContext } from '../App'

const NewsFeed = () => {

    const { data } = useContext(NewsContext)
    const { state, dispatch } = useContext(UserContext)

    if(!state) return null
     

    return(
        <div className = "sideBarRight">
           {data?data.articles.map((news) => {
               return(
                   
                       <div className = "feed-card" alt = "No Photo">
                            <a className = "feed-link" href={news.url}>
                                <div className = "feed-image-wrap"><img src={news.urlToImage} alt=""/></div>
                                <div className = "feed-title">{ news.source.name } : {news.title}</div>
                                <div className = "feed-description">{news.description}</div>
                            </a>
                        </div>
                   
               )
           }) : "Loading" }
        </div>
    )
}

export default NewsFeed 