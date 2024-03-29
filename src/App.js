/*global chrome*/

import React, { Component } from 'react';
import Bookcard from './Bookcard/Bookcard'
import Controls from './Controls'
import './styles/app.css';



class App extends Component {

  constructor(props){
    super(props)
      this.state = {
        loading: true, 
        index: 0, 
        books: []
      }
  }

  componentWillMount(){
    this.getBooks.bind(this)()
  }

  componentDidMount(){
    var self = this; 
    setTimeout(
     function(){
       self.setState({
         loading: false
       })
     }, 1000
    )}

  // componentDidMount(){
  //   this.delay.bind(this)()
  // }


  getBooks(){
    var self = this; 
    chrome.storage.local.get(function(items){
      if(items.data.length > 0){
        self.setState({
          books: items.data
        })
      }
  })}

  changeBook(){
    //loading first five book results from google API to toggle through
    if(this.state.index < 4){
      this.setState({
        index: this.state.index + 1
      })
    }
    else{
      this.setState({index: 0})
    }
  }

  addBook(){
    let book = this.props.info[this.state.index]
    //provide source and date added to book object
    book.source = window.location.href
    book.date = Date.now()


    chrome.storage.local.get(function(items) {
      if (Object.keys(items).length > 0 && items.data) {
          // The data array already exists, add it to localstorage 
          book.key = items.data.length 
          items.data.push(book);
      } else {
          // The data array doesn't exist yet, create it
          book.key = 0; 
          items.data = [book];
      }

      let data = {
        book: book
    }

      data.book.user = items.user
  
      // Now save the updated items using set
        chrome.storage.local.set(items, function() {
            console.log('Data successfully saved to the storage!', items);
        });

        //additional function here to send to a DB for KPI purposes (DAUs, scraping GoogleBooks from client side to get around API limits)--> book + bookISBN + source DB
        chrome.runtime.sendMessage({greeting: "Add Book", data})
      });

       //function to reload from new state/localstorage to show new book added without having to reopen extension
      this.setState({
        books: this.state.books.concat(book)
      })

  }

 //need to implement deleting book function from the server so that deleted books don't reappear when loading from backend rather than local storage 
 //workaround by repopulating SQL DB on next update by taking existing local storage books and sending to backend

  deleteBook(key){
    var self = this
    chrome.storage.local.get(function(items){
      items.data = items.data.filter(book => book.key !== key)
      console.log(items)
      chrome.storage.local.set(items)
      self.setState({
        books: items.data
      })
    })

  
  }

  render(){

    //gets image assets (chrome extension so source changes on build)

    let link = chrome.runtime.getURL("static/media/link.svg")
    let shoppingCart = chrome.runtime.getURL("static/media/shopping-cart.svg")
    let closeButton = chrome.runtime.getURL("static/media/X.svg")
    let plus = chrome.runtime.getURL("static/media/plus.svg")
    let refresh = chrome.runtime.getURL("static/media/refresh.svg")

    //loading while google api fetches, fixed timeout 

    if(this.state.loading){
      return(
      <div style={{backgroundColor: "white", height:"100vh", border:"solid 2px #edf2f7"}}>
       <div id="loader" style={{backgroundColor: "white", display:"flex",marginTop:"10em", justifyContent:"center"}}>
        </div>
      </div>
      )
    }

    else {
      return(
          <div id="main" class="absolute w-76 min-h-full top-0 right-0 bg-white border-solid border-2 border-gray-100">
            <div id="banner" class="shadow-md h-16 w-full flex items-center bg-white">
                <p class="ml-4 text-xl font-semibold">booksaver</p>
            </div>

          {this.props.info ?
            <div id="searchResults" class="flex mt-4">
              <div id="cover" class="flex-none ml-3 mt-4 w-24 h-32">
                  <img class="object-contain shadow-lg rounded-md" src={this.props.info[this.state.index].cover}/>
              </div>
            <div id="bookInfo" class="ml-4 mt-4 mr-2">
                <p id="title" class="flex-none text-lg font-medium">{this.props.info[this.state.index].title}</p>
                <p id="author" class="font-light text-gray-600">{this.props.info[this.state.index].authors}</p>
                <p id="description" class="h-28 mt-2 text-xs font-light text-gray-700 overflow-auto">{this.props.info[this.state.index].description}</p>
                <div id="controls" class="flex flex-row text-xs mt-4">
                      <Controls img={refresh} onClick={this.changeBook.bind(this)} class="bg-purple-200 text-purple-800">Refresh</Controls>
                      <Controls img={plus} onClick={this.addBook.bind(this)} class="bg-green-200 mr-2 text-teal-800">Add</Controls>
                      
                      <a href={"https://www.amazon.com/s?k=" + this.props.info[this.state.index].title + " by " + this.props.info[this.state.index].authors + "&i=stripbooks&ref=nb_sb_noss&tag=babelshelf-20"} target="_blank">
                        <Controls img={shoppingCart} class="bg-orange-200 text-orange-800">Buy</Controls>
                      </a>

                </div>
            </div>
          </div> : null}
    
          <div id="divider" class="mx-4 mt-4 border-b-2 border-grey-100 pb-1">
            <p class="mr-2">Shelf</p>
          </div>
          <div class="flex-none mx-2">
              {this.state.books.slice(0).reverse().map(book => {return(
                <Bookcard book={book} deleteBook={this.deleteBook.bind(this)} shoppingCart={shoppingCart} link={link} closeButton={closeButton}></Bookcard>
              )})}
            </div>
          </div>
      )
  }}
}

   

export default App;
