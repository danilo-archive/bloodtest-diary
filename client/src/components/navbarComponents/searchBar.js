import React, { Component } from 'react';
import styled from "styled-components";

const Container = styled.div`

height: 11px;
width: 200px;
border-radius: 40px;
display: flex;
align-items: center;
padding: 10px;
position: relative;
background: #fff;
border: solid 1px #97a9a9;
margin-right: 10px;


.input {
border: none;
height: 25px;
width: calc(100% - 30px);
color: #1b1b1b;
font-size: 15px;
outline: none;
}

.input:not(:placeholder-shown) + .label {
font-size: 0px;
top: 5px;
color: v;
}

.input:focus ~ .label {
font-size: 0px;
top: 5px;
color:  #97a9a9;
transition: all 0.5s ease;
}

.label {
color: #97a9a9;
position: absolute;
top: 6px;
pointer-events: none;
transition: all 0.5s ease;
}

.search-btn {
background: #0b989d;
border-radius: 20px;
height: 31px;
min-width: 31px;
display: flex;
align-items: center;
box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
justify-content: center;
cursor: pointer;
right: -2px;
position: absolute;
transition: all 1s ease;
marign-left: 3px;
}

.icon {
  display: inline-block;
  fill: white;
  font-size: 1rem;
  height: 1em;
  vertical-align: middle;
  width: 1em;
}

.highlight {
width: 0px;
height: 1px;
background: #97a9a9;
position: absolute;
bottom: 5px;
transition: all 1s ease;
}

.input:focus ~ .highlight {
width: calc(100% - 50px);
transition: all 1s ease;
}
`;

export default class SearchBar extends Component {

    render(){
      return (
      <Container>
            <input type="text" class="input" placeholder="&nbsp;"></input>
            <span class="label">Date</span>
            <span class="highlight"></span>
              <div class="search-btn">
                <svg className="icon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#magnify"/></svg>
              </div>
        <svg xmlns="http://www.w3.org/1999/svg" className="icons"><symbol id="magnify" viewBox="0 0 18 18" height="100%" width="100%"><path d="M12.5 11h-.8l-.3-.3c1-1.1 1.6-2.6 1.6-4.2C13 2.9 10.1 0 6.5 0S0 2.9 0 6.5 2.9 13 6.5 13c1.6 0 3.1-.6 4.2-1.6l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0C4 11 2 9 2 6.5S4 2 6.5 2 11 4 11 6.5 9 11 6.5 11z" fill="#fff" fillRule="evenodd"/></symbol></svg>
      </Container>
      )
    }
}
