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
   fetch("https://www.googleapis.com/books/v1/volumes?q=" + book + "&key=AIzaSyAhuevdlHP58vTlQWDYiZMxtjpfoAf7Xvs")
        .then(response => response.json())
        .then(function(response){                  
                  let info = []; 

                  for(i=0; i<5; i++){
                       let volumeInfo = response.items[i].volumeInfo
                       var book = {
                            title: volumeInfo.title, 
                            subtitle: volumeInfo.subtitle ? volumeInfo.subtitle : "", 
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

addBook = function(){
     
}

chrome.contextMenus.create({
   title: "Add to Booksaver",
   contexts:["selection"],
   onclick: displayBook  // ContextType
})