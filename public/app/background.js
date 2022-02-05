//Call a script on update or install to save the google identification
chrome.runtime.onInstalled.addListener(function(details){
     if(details.reason == "install"){
          chrome.identity.getProfileUserInfo(function(info){
               //action here to set userID to googleID here 
               let userID = info.id
               //better tracking of users than on google dashboard, especially with date 


               //puts it into localstorage 
               chrome.storage.local.get(function(items){
                    //if google ID is null set it as a random generated UUID 
                    items.user = userID
                    //get is not the same as set, need to set it to local storage, different actions depending on install or update 
                    chrome.storage.local.set(items, function(){
                         console.log("Set ID to local storage", items.user)
                    })
               })


               //send userID and email to SQL DB
               let json = JSON.stringify(info)
               console.log(json)

               var http = new XMLHttpRequest(); 
               http.open("POST", "https://booksaver-backend.herokuapp.com/addUser", true);  //send to backend 
               http.setRequestHeader("Content-Type", "application/json"); 
               http.send(json)
          })

          //redirect user to the instruction page: 
          chrome.tabs.create({
               url: 'https://booksaver.info',
               active: true
             });
           
     }
     else if(details.reason == "update"){
          //action here to get user email only if update version = manifest version for the next push, otherwise can assume we have everybody's emails
          //refactor later so that it's the same function as one above 

          var thisVersion = chrome.runtime.getManifest().version
          if(thisVersion = "1.0.33"){
               chrome.identity.getProfileUserInfo(function(info){
                    console.log(info)
                    let userEmail = info.email
                    let userID = info.id

                    chrome.storage.local.get(function(items){
                         items.user = userID

                         chrome.storage.local.set(items, function(){
                              console.log("Set ID to local storage", items.user)
                         })
                    })

                    let json = JSON.stringify(info)
                    console.log(json)

                    var http = new XMLHttpRequest(); 
                    http.open("POST", "https://booksaver-backend.herokuapp.com/addUser", true);  //send to backend 
                    http.setRequestHeader("Content-Type", "application/json"); 
                    http.send(json)
               })
          }
          if(thisVersion = "1.0.34"){
               //function here for redirecting to a webpage for survey information? 
          }
     }
})


//how to reconcile user's email address to their session ID? is there a better way to do this? 
//

// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function(tab) {
   // Send a message to the active tab
   chrome.tabs.query({active: true, currentWindow:true},function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
   });
});

//calling the google search API from background script to avoid cross-origin limitations
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
               // sendInfo("addFromExt", request.data)

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