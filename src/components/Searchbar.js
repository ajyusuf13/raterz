import React, { useState } from 'react'
import styled from "styled-components"
import Search from './svg/Search';
import { useNavigate } from 'react-router-dom';

const SearchBarDiv = styled.div`
    align-items: center;
    justify-content: center;
    display: flex;
`

const SearchBarInput = styled.input`
    width: 300px;
    height: 18px;
    font-size: 16px;
    border-radius: 10px;
    padding: 7px 10px;
    border: none;
    margin-right: 3px;
    font-family: 'Dosis', sans-serif;

    &:focus {
        outline: none;
    }
`




const Searchbar = () => {
    const [searchInput, setSearchInput] = useState("");

    const navigate = useNavigate(); 
    const executeSearch = () => {
        console.log("going to searchresults")
        if (searchInput) {
            navigate(`/searchresults?title=${searchInput}`);
        }
        else {
            navigate('/searchresults')
        }
    }


  return (
    <SearchBarDiv>
        <SearchBarInput onChange={(e) => setSearchInput(e.target.value)} value={searchInput} setplaceholder='Movies, TV Shows...'></SearchBarInput>
        <div>
            <Search executeSearch={executeSearch}/>
        </div>
    </SearchBarDiv>
  )
}

export default Searchbar