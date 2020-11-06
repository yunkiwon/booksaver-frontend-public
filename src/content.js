/*global chrome*/
/* src/content.js */

import React from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer }from 'react-frame-component';
import App from "./App";


class Main extends React.Component {
    render() {
        return (
            <Frame head={[<link type="text/css" rel="stylesheet" href={chrome.runtime.getURL("/static/css/content.css")} ></link>]}> 
               <FrameContextConsumer>
               {
                  ({document, window}) => {
                    return <App document={document} window={window} info={this.props.info} isExt={true}/> 
                  }
                }
                </FrameContextConsumer>
            </Frame>
        )
    }
}



function load(info){
  const app = document.createElement('div');
  app.id = "my-extension-root";
  document.body.appendChild(app);
  if(info){
    ReactDOM.render(<Main info={info}/>, app);
  } else {
    ReactDOM.render(<Main />, app);
  }
  app.style.display = "block" 
}

function clickOut(){
  document.getElementById("my-extension-root").remove()
}


chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action") {
       load(request.info);
      }
   }
);

window.addEventListener('click', function(e){   
  if (document.getElementById('my-extension-root').contains(e.target)){
  } else{
    clickOut()
  }
});

window.oncontextmenu = function(e){
  if (document.getElementById('my-extension-root').contains(e.target)){
  } else{
    clickOut()
  }
}

