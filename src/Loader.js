import React from 'react';

export default function Loader() {
  return <div>
    <div id="square1" style={{height:"60px", width:"45px", borderRadius:"6px", backgroundColor:"rgba(255, 146, 84, 0.7)", position:"relative", bottom:"20px", left:"10px"}}></div>
    <div id="square2" style={{height:"60px", width:"45px", borderRadius:"6px", backgroundColor:"rgba(162, 121, 188, 0.7)", position:"relative", top:"20px", right:"10px"}}></div>
  </div>;
}
