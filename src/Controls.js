import React from 'react';

export default function Controls(img) {
  return <div>
    <div class="cursor-pointer w-auto inline-block flex justify-center items-center py-1 px-2 rounded-md mr-2" >
        <img class="w-4 mr-1" src={img}/>
    </div>
  </div>;
}
