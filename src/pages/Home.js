import React, {useEffect, useState} from 'react'
import {db} from '../firebase'
import styled from "styled-components"
import Moment from "react-moment"
import { useNavigate } from 'react-router-dom';
import axios from "axios"

const HomeContainer = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: 2fr 5fr 2fr;
    overflow: hidden;
    height: calc(100vh - 70px);
    width: 100vw;
`

const PopularMoviesContainer = styled.div`
    border-right: 1px solid #000;
    display: block;
    overflow-y: auto;
    background-color: #E6E6FA;
`
const PopularTvContainer = styled.div`
    border-left: 1px solid #000000;
    display: block;
    overflow-y: auto;
    background-color: #E6E6FA;
`

const TrendingMediaDiv = styled.div`
    display: flex;
    padding: 5px 10px;
    margin: 5%;
    color: black;
    align-items: center;
    border-radius: 1rem;
    background-color: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
    overflow: hidden;


    &:hover {
        background-color: lightgray;
    }
`

const H4TrendingTitle = styled.h4`
    margin: 0 0 4px 0;

    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
`

const TrendingTitleandRating = styled.div`
    display: block;
    text-align: left;
    margin-left: 5px;
`

const FeedContainter = styled.div`
    position: relative;
    // background-color: #F0F8FF;
    background-color: #E6E6FA;
    overflow-y: auto;
    width: 100%;
`

const PostDiv = styled.div`
    margin-top: 2%;
    margin-bottom: 5%;
    margin-left: 5%;
    margin-right: 5%;
    background-color: white;
    padding: 10px;
    border-radius: 7px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.4);
    display: flex;
    gap: 7px;

`
const PicDiv = styled.div`
`

const ProfilePic = styled.img`
    border-radius: 50%;
    width: 40px;
    height: 40px;
`
const PostContentDiv = styled.div`
    display: block;
    overflow: hidden;
`
const NameandTimePosted = styled.div`
    margin-bottom: 2px;
`
const MediaImage = styled.img`
    width: 75px;
    height: 100px;
    border-radius: 1rem;
    cursor: pointer;
`
const StyledH3 = styled.h3`
    margin: 1em 0 0 0;
    padding: 5px;
    text-align: center;
    font-family: 'Dosis', sans-serif;
    color: black;
`

const PostedByName = styled.h4`
    color: black;
    margin-top: 8px;
    margin-bottom: 3px;
`
const ReviewAndPosterDiv = styled.div`
    display: flex;
`
const ReviewRatingDiv = styled.div`
    display: block;
`
const RatingText = styled.h4`
    color: black;
    font-family: 'Cabin', sans-serif;
    font-weight: normal;
    margin-top: 4px;
    display: flex;
    margin-bottom: 2px;
`
const MediaSpan = styled.span`
    cursor: pointer;
    color: red;
    line-height: 18px;
    font-size: 18px;
    font-weight: 600;
    white-space: pre;
    
    &:hover {
        text-decoration: underline;
    }
`

const momentStyles = {
    color: "grey",
    fontStyle: "italic",
    fontSize: '14px'
}



export const Home = () => {

    const API_KEY = "9a637b178d3f0923dd00ef0550b24e90";
    const TRENDING_MOVIES_URL = 'https://api.themoviedb.org/3/trending/movie/week?api_key=' +  API_KEY;
    const TRENDING_SHOWS_URL = 'https://api.themoviedb.org/3/trending/tv/week?api_key=' +  API_KEY;

    const [posts, setPosts] = useState([]);

    const [trendingMovies, setTrendingMovies] = useState([]);
    const [trendingShows, setTrendingShows] = useState([]);

    const navigate = useNavigate();

    useEffect(()=>{
        // get posts
        const getPosts = async () => {
            const postsFirebase = [];
            //check later what would happen if there were no posts
            db.collectionGroup("post").orderBy("createdAt", "desc").get()
            .then(querySnapshot => {
                if (querySnapshot.docs.length) {
                    querySnapshot.docs.map(docSnap => {
                        postsFirebase.push(docSnap.data());
                    })
                    setPosts(postsFirebase);
                }
            })
        }

        const getTrendingMoviesandShows = async () => {
            await axios.get(TRENDING_MOVIES_URL)
            .then(resp => {
                setTrendingMovies(resp.data.results)
            })

            await axios.get(TRENDING_SHOWS_URL)
            .then(resp => {
                setTrendingShows(resp.data.results)
            })
        }
        getPosts();
        getTrendingMoviesandShows();

    }, [])

      

  return (
    <HomeContainer>
        <PopularMoviesContainer>
            <StyledH3 style={{color: 'black', marginTop: '1em'}}>Trending Movies This Week</StyledH3>
            {trendingMovies?.map((movie, i) => (
                <TrendingMediaDiv key={i}>
                    <PicDiv style={{width: '75px', height: '100px'}}>
                        <MediaImage onClick={() => navigate("/movie/" + movie.id)} src={'https://image.tmdb.org/t/p/original/' + movie.poster_path} alt='No Poster'/>
                    </PicDiv>
                    <TrendingTitleandRating>
                        <H4TrendingTitle onClick={() => navigate("/movie/" + movie.id)}>{movie.original_title}</H4TrendingTitle>
                        <h5 style={{margin: '0', color: 'grey'}}>avg. rating: {movie.vote_average}</h5>
                    </TrendingTitleandRating>
                </TrendingMediaDiv>
            ))}
        </PopularMoviesContainer>
        <FeedContainter key="feed">
            <StyledH3>Feed</StyledH3>
            {posts.map((post, i) => (
                <PostDiv key={i}>
                    <PicDiv>
                        <ProfilePic src={post.photoURL} alt='No Profile Pic'/>
                    </PicDiv>
                    <PostContentDiv>
                        <NameandTimePosted>
                            <PostedByName>{post.name}</PostedByName>
                            <Moment style={momentStyles}fromNow>{post.createdAt.toDate()}</Moment>
                        </NameandTimePosted>
                        <ReviewAndPosterDiv>
                            {/*<MediaImage src={post.mediaPoster} alt="No Poster"/>*/}
                            <ReviewRatingDiv>
                                <RatingText>just gave 
                                    <MediaSpan onClick={() => navigate(`/${post.type}/${post.mediaId}`)}> {post.title}&nbsp;</MediaSpan>
                                    a rating of
                                    <span style={{color: '#008080', lineHeight: '18px', fontSize: '18px', whiteSpace: 'pre'}}> {post.rating}⭐&nbsp;</span>
                                    !!!
                                </RatingText>
                            </ReviewRatingDiv>
                        </ReviewAndPosterDiv>
                    </PostContentDiv>
                </PostDiv>
            ))}
        </FeedContainter>
        <PopularTvContainer>
            <StyledH3 style={{marginTop: '1em'}}>Trending Shows This Week</StyledH3>
            {trendingShows?.map((show, i) => (
                <TrendingMediaDiv key={i}>
                    <PicDiv style={{width: '75px', height: '100px'}}>
                        <MediaImage onClick={() => navigate("/tv/" + show.id)} src={'https://image.tmdb.org/t/p/original/' + show.poster_path} alt='No Poster'/>
                    </PicDiv>
                    <TrendingTitleandRating>
                        <H4TrendingTitle onClick={() => navigate("/tv/" + show.id)}>{show.name}</H4TrendingTitle>
                        <h5 style={{margin: '0', color: 'grey'}}>avg. rating: {show.vote_average}</h5>
                    </TrendingTitleandRating>
                </TrendingMediaDiv>
            ))}
        </PopularTvContainer>
    </HomeContainer>
    
  )
}

export default Home;