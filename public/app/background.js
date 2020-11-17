// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function(tab) {
   // Send a message to the active tab
   chrome.tabs.query({active: true, currentWindow:true},function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
   });
});

displayBook = function(word){
   var book = word.selectionText
   fetch("https://www.googleapis.com/books/v1/volumes?q=" + book)
        .then(response => response.json())
        .then(function(response){                  
                  let info = []; 

                  for(i=0; i<5; i++){
                       let volumeInfo = response.items[i].volumeInfo
                       var book = {
                            title: volumeInfo.title, 
                            subtitle: volumeInfo.subtitle ? volumeInfo.subtitle : "", 
                            ISBN: volumeInfo.industryIdentifiers[0] ? volumeInfo.industryIdentifiers[0].identifier :  "", 
                            selfLink: response.items[i].selfLink ? response.items[i].selfLink: "", 
                            authors: volumeInfo.authors ? volumeInfo.authors[0] : undefined, 
                            selfLink: response.items[i].selfLink, 
                            cover: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail.replace('&edge=curl', '') : undefined, 
                            description: volumeInfo.description? volumeInfo.description : "", 
                       }

                       info.push(book);
                       if(info.length == 5){
                           console.log(info)
                            chrome.tabs.query({active: true, currentWindow:true},function(tabs) {
                              var activeTab = tabs[0];
                              chrome.tabs.sendMessage(activeTab.id, {message: "clicked_browser_action", info});
                         })
                       }
                  }
             
        })
   }


//onMessage, send book to a backend server 
chrome.runtime.onMessage.addListener(
     function(request){
          if (request.greeting == "Add Book"){
               console.log(request); 

               let json = JSON.stringify(request.data)
               var http = new XMLHttpRequest(); 
               http.open("POST", "https://booksaver-backend.herokuapp.com/addFromExt", true);  //send to backend 
               http.setRequestHeader("Content-Type", "application/json"); 
               http.send(json)
          }
     }
)


chrome.contextMenus.create({
   title: "Add to Booksaver",
   contexts:["selection"],
   onclick: displayBook  // ContextType
})