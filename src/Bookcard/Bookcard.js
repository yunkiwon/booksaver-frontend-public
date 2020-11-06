import React, { Component } from 'react'



export default class Bookcard extends Component {
    //
    render() {
        return (
            <div id="bookComponent" class="grid grid-cols-9 w-full py-2 rounded-md my-1 border-solid border-2 border-gray-200">
          <div id="cover" class="col-span-2 flex justify-self-center align-self-center w-12 h-20">
              <img class="rounded-sm" src={this.props.book.cover}/>
          </div>
          <div id="info" class="col-span-5 ml-2">
              <p id="title" class="flex-1 text-sm font-medium">{this.props.book.title}</p>
              <p id="author" class="text-xs font-light text-gray-600">{this.props.book.authors}</p>
              <div id="date" class="mt-5">
                  <p class="text-xs font-light text-gray-500"></p>
              </div>
          </div>
          <div id="controls" class="flex-none grid grid-rows-2 col-span-2 mr-2">
                <div id="delete" class="flex items-start justify-center justify-self-end mr-2 text-gray-500" onClick={this.props.deleteBook.bind(this, this.props.book.key)}>
                    <img class="w-4 opacity-50 hover:opacity-75" src={this.props.closeButton}/>
                </div>
                <div class="flex justify-self-end self-end">
                <a href={this.props.book.source} target="_blank">
                    <div class="flex justify-center items-center border-solid border-1 border-gray-300 rounded-full h-8 w-8 mr-2">
                                <img src={this.props.link} class="object-contain w-4 opacity-50 hover:opacity-100" alt="link" />
                    </div>
                  </a>
                  <a href={"https://www.amazon.com/s?k=" + this.props.book.title + " by " + this.props.book.authors + "&i=stripbooks&ref=nb_sb_noss&tag=babelshelf-20"} target="_blank">
                  <div class="flex justify-center items-center border-solid border-1 border-gray-300 rounded-full h-8 w-8 mr-2">
                             <img src={this.props.shoppingCart} class="object-contain w-4 opacity-50 hover:opacity-100" alt="shopping-cart" />
                  </div>
                  </a>
              </div>
          </div>
      </div>
        )
    }
}
