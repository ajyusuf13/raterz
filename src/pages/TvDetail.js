import React, { useEffect, useState } from 'react'
import moment from 'moment';
import axios from "axios";
import { useParams } from 'react-router-dom';
import styled from "styled-components";
import img from "../NoMoviePoster.jpeg";
import {db, auth} from "../firebase"
import { serverTimestamp } from 'firebase/firestore';
import ReactStars from "react-rating-stars-component";



const TvDetailContainer = styled.div`
    position: relative;
    height: calc(100vh - 70px);
    justify-content: center;
    align-items: center;
    display: flex;
`

const TvDetailBackgroundDiv = styled.div`
    width: 95vw;
    height: 100%;
    background-size: cover;
`

const TvDetailBlurDiv = styled.div `
    width: 95vw;
    height: 100%;
    backdrop-filter: blur(0px) grayscale(0%);
    display: flex;
    align-items: center;
    justify-content: center;
`

const TvDetailInfoDiv = styled.div`
    width: 1100px;
    height: 500px;
    display: grid;
    grid-template-columns: 2fr 4fr;
    border: 2px solid #000;
    background:rgba(1,1,1,0.75);    // grey transparent background
`
const TvPosterandInfoDiv = styled.div`
    // border: 1px solid #fff;
    padding: 10px;
    display: block;
    text-align: center;
    overflow: scroll;
`

const TvPosterImg = styled.img`
    width: 250px;
    height: 350px;
    margin-top: 10px;
`

const TvInformation = styled.div`
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
const TextareaTvReview = styled.textarea`
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

const DisplayTvDetail = ({TvDetail, rating, ratingChanged, review, setReview, clearReview, saveReview}) => {
    const image = TvDetail.poster_path ? 'https://image.tmdb.org/t/p/original/' + TvDetail.poster_path : img;
    const backgroundImage =  TvDetail.backdrop_path ? 'https://image.tmdb.org/t/p/original/' + TvDetail.backdrop_path : "";

    const shareRating = async () => {
        await db.collection("posts").doc(auth.currentUser.uid).collection("post").add({
            rating: rating,
            title: TvDetail.name,
            mediaPoster: TvDetail.poster_path ? 'https://image.tmdb.org/t/p/original/' + TvDetail.poster_path : img,
            type: "tv",
            mediaId: TvDetail.id,
            name: auth.currentUser.displayName,
            userUID: auth.currentUser.uid,
            photoURL: auth.currentUser.photoURL,
            createdAt: serverTimestamp(),
        })
        alert("post has been shared");
    };


    return (
        <React.Fragment>
            <TvDetailBackgroundDiv style={{backgroundImage: `url(${backgroundImage})`}}>
                <TvDetailBlurDiv>
                    <TvDetailInfoDiv>
                        <TvPosterandInfoDiv>
                            <TvPosterImg style={{}} src={image} alt="No TV Poster"/>
                            {TvDetail.first_air_date? <H4Tag style={{margin: '5px 0 0 0'}}>First Aired: {moment(TvDetail.first_air_date, "Y-M-D").format("MMMM D, Y")}</H4Tag> : null}
                            {TvDetail.last_air_date? 
                                <H4Tag style={{margin: '5px 0 0 0'}}>Last Aired: {moment(TvDetail.last_air_date, "Y-M-D").format("MMMM D, Y")} ({TvDetail.status})</H4Tag> 
                                : null}
                            {TvDetail.tagline ? <p>{TvDetail.tagline}</p> : null}
                        </TvPosterandInfoDiv>
                        <TvInformation>
                            <H3Tag>{TvDetail.name}</H3Tag>
                            {TvDetail.genres.length ? (
                            <p style={{fontStyle: 'italic', marginBottom: '5px', color: 'red'}}>
                                <span style={{fontSize: '16px', fontStyle: 'italic', color: 'aqua'}}> (tv show) </span>
                                {TvDetail.genres.map(genre => {return genre.name}).join(", ")}
                            </p>
                            ) : null}
                            {TvDetail.overview ? <p>{TvDetail.overview}</p> : null}
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
                                <TextareaTvReview 
                                    // {...register("review")}
                                    spellCheck="false"
                                    id="textAreaReview"
                                    placeholder={'This tv show sucks...? or?'}
                                    type="text"
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                ></TextareaTvReview>
                                <ButtonGroupDiv>
                                    <Button className='clear' onClick={clearReview}>clear</Button>
                                    <Button className='save' onClick={saveReview}>save</Button>
                                </ButtonGroupDiv>
                            </TextareaDiv>
                            
                        </TvInformation>
                
                    </TvDetailInfoDiv>
                </TvDetailBlurDiv>
            </TvDetailBackgroundDiv>
        </React.Fragment>
    )


}

    
const TvDetail = () => {

    const TvId = useParams().id;
    const API_KEY = "9a637b178d3f0923dd00ef0550b24e90";
    const [TvDetail, setTvDetail] = useState();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");

    const TV_DETAIL_URL = "https://api.themoviedb.org/3/tv/" + TvId + 
        "?" + new URLSearchParams({api_key: API_KEY});


    const ratingChanged = (newRating) => {
        console.log(newRating);
        setRating(newRating);
        db.collection("tv").doc(auth.currentUser.uid).collection("reviews").doc(TvId)
            .set(
            {rating : newRating},
            {merge : true})
    };

    const clearReview = () => {
        console.log("clearing review");
        setReview("");
        console.log(review);
        setRating(0);
        document.getElementById("textAreaReview").value = "";
        
        console.log("text area should be empty");
        db.collection("tv").doc(auth.currentUser.uid).collection("reviews").doc(TvId)
            .delete();
    }

    const saveReview = () => {
        if (review) {
            db.collection("tv").doc(auth.currentUser.uid).collection("reviews").doc(TvId)
            .set(
            {   review : review,
                timestamp : serverTimestamp()
            },
            {merge: true});
            alert("review has been saved");
        }
    }

    useEffect(() => {
        axios.get(TV_DETAIL_URL)
        .then(resp => {
            console.log(resp.data);
            setTvDetail(resp.data);
        })

        db.collection("tv").doc(auth.currentUser.uid).collection("reviews").doc(TvId).get()
            .then((docSnap) => {
                const reviewDB = docSnap.get("review");
                if (reviewDB === undefined) {
                    console.log("There was no saved review");
                } else {
                    // put the post in the text area but check if it's undefined
                    setReview(reviewDB);
                    console.log("There was a saved review: " + reviewDB);

                    // check if there is a rating
                    const tvRating = docSnap.get("rating");
                    console.log("tvRating rating", JSON.stringify(tvRating));
                    setRating(tvRating ? tvRating : 0);
                }
            })
            .catch((err) => {
                console.log(err);
                console.log("error trying to get document from firestore")
            })

    }, [])


  return (
    <TvDetailContainer>
        {TvDetail ? <DisplayTvDetail 
            TvDetail={TvDetail}
            review={review}
            setReview={setReview}
            rating={rating} 
            ratingChanged={ratingChanged}
            clearReview={clearReview}
            saveReview={saveReview}
        /> 
        : <p>No TV Detail</p>}
    </TvDetailContainer>
  )
}

export default TvDetail