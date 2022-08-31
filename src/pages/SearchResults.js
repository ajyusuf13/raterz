import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from "axios";
import styled from "styled-components";
import img from "../NoMoviePoster.jpeg";
import moment from 'moment';

const SearchResultsContainer = styled.div`
    position: relative;
    overflow: hidden;
    height: calc(100vh - 70px);
    overflow: auto;
    justify-content: center;
    display: flex;
    // background-color: white;

`

const TableSearchResults = styled.table`
    padding: 10px;
    width: 80vw;
`

const TBodySearchResults = styled.tbody`
    display: block;
`

const TRowSearchResults = styled.tr`
    display: flex;
    height: 175px;
    margin: 15px;
    align-items: center;
`

const H3Tag = styled.h3`
    font-family: 'Fredoka One', cursive;
    font-size: 20px;
    
    &:hover {
        cursor: pointer;
        text-decoration: underline;

    }
`

const PTagMovieInfo = styled.p`
    font-size: 12px;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
`

const TDMoviePicture = styled.td`
    height: 175px;
    width: 125px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 15px 0 rgba(0, 0, 0, 0.75);
    cursor: pointer;

`


const TDMovieInfo = styled.td`
    //background: rgb(64,78,240);
    // background: linear-gradient(342deg, rgba(64,78,240,1) 22%, rgba(189,85,247,1) 100%);
    
    background-color: #242124;
    color: white;
    display: block;
    overflow-y: auto;
    margin-left: 10px;
    height: 140px;
    padding: 5px 10px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 6px 15px 0 rgba(0, 0, 0, 0.75);
    border: 1px solid gray;

    &::-webkit-scrollbar {
        display: none;
    }


`


const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    const API_KEY = "9a637b178d3f0923dd00ef0550b24e90";
    const MOVIE_SEARCH_URL = "https://api.themoviedb.org/3/search/multi?"
    const navigate = useNavigate();

    useEffect(() => {
        const title = searchParams.get("title");
        console.log(title);
        if (title) {
            console.log("title exists: " + title);
            axios.get(MOVIE_SEARCH_URL + new URLSearchParams({api_key: API_KEY, query : title}))
            .then((resp) => {
                console.log(resp);
                setResults(resp.data.results);


            })
            .catch(err => {console.log(err)})
        }


    }, [searchParams])

    const TVShow = ({media}) => {
        console.log("trying to render tv show");
        const image = media.poster_path ? 'https://image.tmdb.org/t/p/original/' + media.poster_path : img;

        return (
            <React.Fragment>
                <TDMoviePicture style={{}} onClick={() => navigate("/tv/" + media.id)}>
                    <img style={{borderRadius: '3px'}} width="125" height="175" src={image} alt="No Movie Poster"/>
                </TDMoviePicture>
                <TDMovieInfo style={{width: 'calc(80vw - 125px)', borderRadius: '10px'}}>
                    <H3Tag onClick={() => navigate("/tv/" + media.id)}>{media.name} 
                        <span style={{fontSize: '16px', fontStyle: 'italic', color: 'aqua'}}> (tv show)</span>
                    </H3Tag>
                    <h5>{moment(media.first_air_date, "Y-M-D").format("MMMM D, Y")}  {media.vote_count !== 0 ? `|  Avg. Rating: ${media.vote_average}` : "" }</h5>
                    <PTagMovieInfo>{media.overview}</PTagMovieInfo>
                </TDMovieInfo>
            </React.Fragment>

        )
    }

    const Movie = ({media}) => {
        const image = media.poster_path ? 'https://image.tmdb.org/t/p/original/' + media.poster_path : img;

        return (
            <React.Fragment>
                <TDMoviePicture style={{}} onClick={() => navigate("/movie/" + media.id)}>
                    <img style={{borderRadius: '3px'}} width="125" height="175" src={image} alt="No Movie Poster"/>
                </TDMoviePicture>
                <TDMovieInfo style={{width: 'calc(80vw - 125px)', borderRadius: '10px'}}>
                    <H3Tag onClick={() => navigate("/movie/" + media.id)}>{media.original_title}</H3Tag>
                    <h5>{moment(media.release_date, "Y-M-D").format("MMMM D, Y")}  {media.vote_count !== 0 ? `|  Avg. Rating: ${media.vote_average}` : "" }</h5>
                    <PTagMovieInfo>{media.overview}</PTagMovieInfo>
                </TDMovieInfo>
            </React.Fragment>

        )
    }



    const DisplaySearchResults = () => {
        console.log("displaying search results...");
        return (
            <TableSearchResults>
                <TBodySearchResults>
                    {results.map(media => (media.media_type !== "person" &&
                        <TRowSearchResults key={media.id}>
                            {media.media_type === "tv" ? <TVShow media={media}/> : <Movie media={media}/>}
                        </TRowSearchResults>
                    ))}
                </TBodySearchResults>
            </TableSearchResults>
        )
    }

  return (
    <SearchResultsContainer>
        {results ? <DisplaySearchResults/> :
        <p>No search results</p>
        }
    </SearchResultsContainer>
  )
}

export default SearchResults;

