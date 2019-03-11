import React, { Component } from 'react';
import LoadingAnimation from "./loadingAnimation";
import "./loadingScreen.css";


export default class extends Component{
    render(){
        return(
              <div className={"alertWindow"}>
                <LoadingAnimation/>
                <div className={"dialog"}>
                  <h3 className="override">Connection to server lost...</h3>
                  <p className="override">If the problem persists contact your IT department.</p>
                </div>
              </div>
        )
    }
}
