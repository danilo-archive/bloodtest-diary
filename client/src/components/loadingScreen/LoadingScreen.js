import React, { Component } from 'react';
import "./loadingScreen.css";


export default class extends Component{
    render(){
        return(
              <div className={"alertWindow"}>
                <div className={"loadingAnimation"}>
                  <div id='l1' class='line'></div>
                  <div id='l2' class='line'></div>
                  <div id='l3' class='line'></div>
                  <div id='l4' class='line'></div>
                  <div id='l5' class='line'></div>
                  <div id='l6' class='line'></div>
                  <div id='l7' class='line'></div>
                  <div id='l8' class='line'></div>
                  <div id='l9' class='line'></div>
                  <div id='l10' class='line'></div>
                </div>
                <div className={"dialog"}>
                  <h3 className="override">Connection to server lost...</h3>
                  <p className="override">If the problem presists contact your IT department.</p>
                </div>
              </div>
        )
    }
}
