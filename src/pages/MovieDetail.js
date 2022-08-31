import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from "styled-components"
import axios from "axios"
import img from "../NoMoviePoster.jpeg";
import ReactStars from "react-rating-stars-component";
import moment from 'moment';
import {useForm} from "react-hook-form";
import {db, auth} from "../firebase"
import {serverTimestamp} from "firebase/firestore";
// import Modal from "react-modal"


const MovieDetailContainer = styled.div`
    position: relative;
    height: calc(100vh - 70px);
    justify-content: center;
    align-items: center;
    display: flex;
`

const MovieDetailBackgroundDiv = styled.div`
    width: 95vw;
    height: 100%;
    background-size: cover;
`

const MovieDetailBlurDiv = styled.div `
    width: 95vw;
    height: 100%;
    backdrop-filter: blur(0px) grayscale(0%);
    display: flex;
    align-items: center;
    justify-content: center;
`

const MovieDetailInfoDiv = styled.div`
    width: 1100px;
    height: 500px;
    display: grid;
    grid-template-columns: 2fr 4fr;
    border: 2px solid #000;
    background:rgba(1,1,1,0.75);    // grey transparent background
`
const MoviePosterandInfoDiv = styled.div`
    // border: 1px solid #fff;
    padding: 10px;
    display: block;
    text-align: center;
    overflow: hidden;
`

const MoviePosterImg = styled.img`
    width: 250px;
    height: 350px;
    margin-top: 20px;
`

const MovieInformation = styled.div`
    display: block;
    overflow: auto;
    padding: 10px;
    // border: 1px solid #fff;
`
const RatingDiv = styled.div`
    display: flex;
`

const TextareaDiv = styled.div`
    display: block;
    margin-top: 1em;
`
const TextareaMovieReview = styled.textarea`
    width: 90%;
    height: 150px;
    padding: 10px;
    border-radius: 7px;
    font-family: 'Cabin', sans-serif;
    font-size: 18px;
    background:rgba(1,1,1,0.8);     
    // color: black;
    color: white;
    
    &:focus {
        outline: none;
    }
`
const ShareButton = styled.button`
    padding: 0;
    width: 55px;
    height: 30px;
    margin-top: 6px;
    margin-left: 12px;
    border-radius: 7px;
    border: none;
    
    &.clickable {
        transition: all 0.2s ease;
        background-color: #00FFFF;
        cursor: pointer;

        &:hover {
        transform: scale(1.05);
        background-color: #00BFFF;
        }
    }
    &.disabled {
        background-color: gray;
    }
`

const ButtonGroupDiv = styled.div`
    width: 90%;
    padding: 10px;
    display: flex;
    justify-content: right;
`

const Button = styled.button`
    padding: 0;
    border-radius: 7px;
    width: 60px;
    height: 25px;
    border: none;
    margin-right: 8px;
    transition: all 0.2s ease;
    color: black;
    font-family: 'Dosis', sans-serif;

    &:hover {
        transform: scale(1.05);
        cursor: pointer;
    }

    &.save {
        background-color: #00FA9A;

    }

    &.clear {
        background-color: #C0C0C0;

    }
`

const H2RatingNumber = styled.h2`
    margin: 12px 0 10px 10px;

    &.ratingString {
        margin: 16px 0 10px 10px;
        font-size: 16px;


    }

`

const H3Tag = styled.h3`
    font-family: 'Fredoka One', cursive;
    font-size: 34px;
    margin-top: 10px;
    margin-bottom: 10px;
`

const H4Tag = styled.h4`
    font-style: italic;
    color: white;
`



const DisplayMovieDetail = ({movieDetail, rating, ratingChanged, review, setReview, handleSubmit, clearReview, saveReview}) => {
    const image = movieDetail.poster_path ? 'https://image.tmdb.org/t/p/original/' + movieDetail.poster_path : img;
    const backgroundImage =  movieDetail.backdrop_path ? 'https://image.tmdb.org/t/p/original/' + movieDetail.backdrop_path : "";

    const shareRating = async () => {
        await db.collection("posts").doc(auth.currentUser.uid).collection("post").add({
            rating: rating,
            title: movieDetail.original_title,
            mediaPoster: movieDetail.poster_path ? 'https://image.tmdb.org/t/p/original/' + movieDetail.poster_path : img,
            type: "movie",
            mediaId: movieDetail.id,
            name: auth.currentUser.displayName,
            userUID: auth.currentUser.uid,
            photoURL: auth.currentUser.photoURL,
            createdAt: serverTimestamp(),
        })
        alert("post has been shared");
    };
    
    return (
        <React.Fragment>
            <MovieDetailBackgroundDiv style={{backgroundImage: `url(${backgroundImage})`}}>
                <MovieDetailBlurDiv>
                    <MovieDetailInfoDiv>
                        <MoviePosterandInfoDiv>
                            <MoviePosterImg style={{}} src={image} alt="No Movie Poster"/>
                            {movieDetail.release_date? <H4Tag style={{}}>{moment(movieDetail.release_date, "Y-M-D").format("MMMM D, Y")}</H4Tag> : null}
                            {movieDetail.tagline ? <p>{movieDetail.tagline}</p> : null}
                        </MoviePosterandInfoDiv>
                        <MovieInformation>
                            <H3Tag>{movieDetail.original_title}</H3Tag>
                            {movieDetail.genres.length ? (
                            <p style={{fontStyle: 'italic', marginBottom: '5px', color: 'red'}}>

                                {movieDetail.genres.map(genre => {return genre.name}).join(", ")}
                            </p>
                            ) : null}
                            {movieDetail.overview ? <p>{movieDetail.overview}</p> : null}
                            <RatingDiv>
                                <ReactStars
                                key={`stars_${rating}`}
                                value={Math.max(0, rating)}
                                count={10}
                                onChange={ratingChanged}
                                size={30}
                                isHalf={true}
                                emptyIcon={<i className="far fa-star"></i>}
                                halfIcon={<i className="fa fa-star-half-alt"></i>}
                                fullIcon={<i className="fa fa-star"></i>}
                                activeColor="#98FB98"
                                />
                                {rating ? <H2RatingNumber>{rating}</H2RatingNumber> : <H2RatingNumber className='ratingString'>No Rating Yet</H2RatingNumber>}
                                <ShareButton onClick={shareRating} disabled={!rating} className={rating ? "clickable" : "disabled"}>share</ShareButton>
                            </RatingDiv>
                            <TextareaDiv>
                                <h5 style={{margin: '0 0 5px 0'}}>Review: </h5>
                                <TextareaMovieReview 
                                    // {...register("review")}
                                    spellCheck="false"
                                    id="textAreaReview"
                                    placeholder={'This movie sucks...? or?'}
                                    type="text"
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                ></TextareaMovieReview>
                                <ButtonGroupDiv>
                                    <Button className='clear' onClick={handleSubmit(clearReview)}>clear</Button>
                                    <Button className='save' onClick={handleSubmit(saveReview)}>save</Button>
                                </ButtonGroupDiv>
                            </TextareaDiv>
                            
                        </MovieInformation>
                
                    </MovieDetailInfoDiv>
                </MovieDetailBlurDiv>
            </MovieDetailBackgroundDiv>
        </React.Fragment>
    )

}


const MovieDetail = () => {
    const movieId = useParams().id;
    const API_KEY = "9a637b178d3f0923dd00ef0550b24e90";
    const [movieDetail, setMovieDetail] = useState();

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const {register, getValues, handleSubmit} = useForm();


    const MOVIE_DETAIL_URL = "https://api.themoviedb.org/3/movie/" + movieId + 
        "?" + new URLSearchParams({api_key: API_KEY});

    const ratingChanged = (newRating) => {
        console.log(newRating);
        setRating(newRating);
        db.collection("movies").doc(auth.currentUser.uid).collection("reviews").doc(movieId)
            .set(
            {   rating : newRating,
                timestamp : serverTimestamp()
            },
            {merge : true})
    };

    const clearReview = () => {
        console.log("clearing review");
        setReview("");
        console.log(review);
        setRating(0);
        document.getElementById("textAreaReview").value = "";
        
        console.log("text area should be empty");
        db.collection("movies").doc(auth.currentUser.uid).collection("reviews").doc(movieId)
            .delete();
    }

    const saveReview = () => {
        if (review) {
            db.collection("movies").doc(auth.currentUser.uid).collection("reviews").doc(movieId)
            .set(
            {   review : review,
                timestamp : serverTimestamp()
            },
            {merge: true});
            alert("review has been saved");
        }
    }



    useEffect(() => {
        axios.get(MOVIE_DETAIL_URL)
        .then(resp => {
            console.log(resp.data);
            setMovieDetail(resp.data);
        })

        db.collection("movies").doc(auth.currentUser.uid).collection("reviews").doc(movieId).get()
            .then((docSnap) => {
                const reviewDB = docSnap.get("review");
                if (reviewDB === undefined) {
                    console.log("There was no saved review");
                } else {
                    // put the post in the text area but check if it's undefined
                    setReview(reviewDB);
                    console.log("There was a saved review: " + reviewDB);
                }

                // check if there is a rating
                const movieRating = docSnap.get("rating");
                console.log("movieRating rating", JSON.stringify(movieRating));
                setRating(movieRating ? movieRating : 0);

                
            })
            .catch((err) => {
                console.log(err);
                console.log("error trying to get document from firestore")
            })

    }, []);


  return (
    <MovieDetailContainer>
        {movieDetail ? <DisplayMovieDetail 
            movieDetail={movieDetail}
            review={review}
            setReview={setReview}
            rating={rating} 
            handleSubmit={handleSubmit}
            ratingChanged={ratingChanged}
            clearReview={clearReview}
            saveReview={saveReview}
        /> 
        : <p>Movie Detail</p>}
    </MovieDetailContainer>
  )
}

export default MovieDetail