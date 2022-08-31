import React, { useEffect, useState } from 'react'
import {db, auth} from "../firebase"
import styled from "styled-components"
import axios from 'axios'
import img from "../NoMoviePoster.jpeg";
import ReactStars from "react-rating-stars-component";
import { useNavigate } from 'react-router-dom';



const RatingsScreenContainer = styled.div`
    position: relative;
    height: calc(100vh - 70px);
    width: 100vw;
    display: block;
    text-align: center;
    align-items: center;
    overflow: hidden;
`

const Image = styled.img`
    border-radius: 3px;
    width: 75px; 
    height: 125px;
`

const RatingsContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    height: calc(100vh - 225px);
`

const MovieRatings = styled.div`
    width: 30%;
    height: 67vh;
    overflow: hidden;
    // border: 1px solid #fff;
    display: block;
    border-radius: 1rem;
    justify-content: center;
    margin-left: 10em;
    // background-color: #191414;
    background-color: #111;

`

const TvRatings = styled.div`
    width: 30%;
    height: 67vh;
    display: block;
    border-radius: 1rem;
    margin-right: 10em;
    justify-content: center;
    background-color: #111;

`

const Table = styled.table`
    width: 85%;
    padding: 10px;
    // border: 1px solid #fff;
    border-radius: 7px;
    margin-left: auto;
    margin-right: auto;
    // background:rgba(1,1,1,0.5);
    background-color: #343434;
`

const TBody = styled.tbody`
    display: block;
    overflow-y: auto;
    max-height: calc(65vh - 85px);
`

const TRow = styled.tr`
    display: flex;
    margin: 5px;
    align-items: center;

    &:hover {
        cursor: pointer;
        background-color: lightgray;
    }
`

const TDInfo = styled.td`
    display: block;
    text-align: left;
    padding: 10px;
`

const RatingDiv = styled.div`
    display: flex;
    align-items: center;
`

const H3Tag = styled.h3`
    margin-top: 2em;
    font-size: 26px;
`

const H4Tag = styled.h4`
    margin-top: 1em;
    font-size: 20px;
    margin-bottom: 5px;
    font-family: 'Dosis', sans-serif;
`

const RatingNumberStrong = styled.strong`
    margin-left: 7px;
    margin-top: 4px;
`


const MyRatings = () => {

    const [movieRatings, setMovieRatings] = useState([]);
    const [tvRatings, setTvRatings] = useState([]);
    const [movieRatingsDict, setMovieRatingsDict] = useState({});
    const [showRatingsDict, setShowRatingsDict] = useState({});

    const navigate = useNavigate();

    const API_KEY = "9a637b178d3f0923dd00ef0550b24e90";
    const TV_DETAIL_URL = "https://api.themoviedb.org/3/tv/"; 
    const MOVIE_DETAIL_URL = "https://api.themoviedb.org/3/movie/"; 
    // + movieId + 
    //     "?" + new URLSearchParams({api_key: API_KEY});

    
    useEffect(() => {
        const movieIds = []
        const movies = [];
        const showIds = [];
        const shows = [];
        let movieDict = {};
        let showDict = {};


        

        const getMovies = async () => {
            // get movies
            const subscriber = await db.collection("movies").doc(auth.currentUser.uid).collection("reviews").orderBy("timestamp", "desc").get()
            .then((querySnap) => {
                if (querySnap) {
                    querySnap.forEach((docSnap) => {
                        movieDict[docSnap.id] = docSnap.data().rating;
                        movieIds.push(docSnap.id);
                    });
                    setMovieRatingsDict(movieDict);
                }
                console.log("movieDict: " + JSON.stringify(movieDict));
    
                // iterate through the movieIds array and retrieve movie data and append to movies array
                if (movieIds.length) {
                    movieIds.map(movieId => {
                        axios.get(MOVIE_DETAIL_URL + movieId + "?" + new URLSearchParams({api_key: API_KEY}))
                        .then(resp => {
                            // console.log(resp);
                            movies.push(resp.data);
                            setMovieRatings(movies);

                        })
                    })

                }
            }) 
            .catch(err => {console.log(err);})
        }

        const getTvShows = async () => {
            // get tv shows
            const sub = await db.collection("tv").doc(auth.currentUser.uid).collection("reviews").orderBy("timestamp", "desc").get()
            .then((querySnap) => {
                if (querySnap) {
                    querySnap.forEach((docSnap) => {
                        // console.log(docSnap.data().rating);
                        showDict[docSnap.id] = docSnap.data().rating;
                        showIds.push(docSnap.id);
                    });
                    setShowRatingsDict(showDict);
    
                }
                console.log("showDict: " + JSON.stringify(showDict));
    
                // iterate through the movieIds array and retrieve movie data and append to movies array
                if (showIds.length) {
                    showIds.map(showId => {
                        axios.get(TV_DETAIL_URL + showId + "?" + new URLSearchParams({api_key: API_KEY}))
                        .then(resp => {
                            // console.log(resp);
                            shows.push(resp.data);
                            setTvRatings(shows);
                        })
                    })
                    
                }
            }) 
            .catch(err => {console.log(err);})
    
        }

        getMovies();
        getTvShows();
        
    }, [])

  return (
    <RatingsScreenContainer>
        <H3Tag>My Ratings</H3Tag>
        <RatingsContainer id='ratignsContainer'>
            <MovieRatings>
                <H4Tag>Movie Ratings</H4Tag>
                <Table>
                    <TBody>
                        {movieRatings.length ? movieRatings?.map(movie => (
                            <TRow onClick={() => navigate("/movie/" + movie.id)} key={movie.id}>
                                <td>
                                    <Image src={movie.poster_path ? 'https://image.tmdb.org/t/p/original/' + movie.poster_path : img}/>
                                </td>
                                <TDInfo>
                                    <H4Tag>{movie.title}</H4Tag>
                                    <RatingDiv>
                                        <ReactStars
                                            value={movieRatingsDict[String(movie.id)]}
                                            edit={false}
                                            count={10}
                                            size={15}
                                            isHalf={true}
                                            emptyIcon={<i className="far fa-star"></i>}
                                            halfIcon={<i className="fa fa-star-half-alt"></i>}
                                            fullIcon={<i className="fa fa-star"></i>}
                                            activeColor="#98FB98"
                                        />
                                        <RatingNumberStrong>{movieRatingsDict[String(movie.id)]}</RatingNumberStrong>
                                    </RatingDiv>
                                    
                                </TDInfo>
                            </TRow>
                        )) : null}
                    </TBody>
                </Table>
            </MovieRatings>
            <TvRatings>
                <H4Tag>TV Show Ratings</H4Tag>
                <Table>
                    <TBody>
                        {tvRatings.length ? tvRatings.map(tvshow => (
                            <TRow onClick={() => navigate("/tv/" + tvshow.id)} key={tvshow.id}>
                                <td>
                                    <Image src={tvshow.poster_path ? 'https://image.tmdb.org/t/p/original/' + tvshow.poster_path : img}/>
                                </td>
                                <TDInfo>
                                    <H4Tag>{tvshow.name}</H4Tag>
                                    <RatingDiv>
                                        <ReactStars
                                            // key={`stars_${rating}`}
                                            value={showRatingsDict[String(tvshow.id)]}
                                            edit={false}
                                            count={10}
                                            size={15}
                                            isHalf={true}
                                            emptyIcon={<i className="far fa-star"></i>}
                                            halfIcon={<i className="fa fa-star-half-alt"></i>}
                                            fullIcon={<i className="fa fa-star"></i>}
                                            activeColor="#98FB98"
                                        />
                                        <RatingNumberStrong>{showRatingsDict[String(tvshow.id)]}</RatingNumberStrong>
                                    </RatingDiv>
                                </TDInfo>
                            </TRow>
                        )) : null}
                    </TBody>
                </Table>


            </TvRatings>
        </RatingsContainer>
        
    </RatingsScreenContainer>
  )
}

export default MyRatings