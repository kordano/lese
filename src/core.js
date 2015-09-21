"use strict"
var model = {bookmarks: [{title: 'GI Joe', ts: 1066, tags: ['a', 'b', 'c'], url: "google.com"},
                         {title: 'GI Jane', ts: 1776 , tags: ['a', 'b', 'c'], url: "google.com"},
                         {title: 'GI Konny', ts: 666, tags: ['a', 'b', 'c'], url: "google"}],
             uri: "localhost:8080"}

function initialConnection(uri){
 var socket = io.connect()
  socket.on('connect', function() {
    console.log("Connected to " + uri)
  })
  socket.on('error', function() {
    console.log("ERROR on SOCKET" + uri)
  })
  socket.on('disconnect', function(){
    console.log("Disconnected from " + uri)
  })
  return socket
}
 
var bookmark = React.createClass({
  render : function() {
    var tags = this.props.tags.map(function (t) {
      return React.DOM.li(null, t);
    });
    var title = React.DOM.a({href: this.props.url},
                            this.props.title);
    var ts = React.DOM.time(null, this.props.ts);
    var tagList = React.DOM.ul(null, tags);
    return React.DOM.li(null, title, ts, tagList);
  }
})

var bookmarkList = React.createClass({
  getInitialState : function() {
    return {
      data: Immutable.Map({searchText: ""})
    }
  },
  handleChange: function(event) {
    console.log(event)
    this.setState(({data}) => ({
      data: data.set('searchText', event.target.value)
    }))
  },
  render : function() {
    var title = React.DOM.h1(null, "Bookmarks");
    var search = React.DOM.input({value: this.state.data.searchText, onChange: this.handleChange})
    var filteredBookmarks = this.props
          .data
          .bookmarks
          .filter(function(b) {
            if (!this.state.data.searchText || 0 === this.state.data.searchText) {
              return true
            } else {
              if (b.title.search(this.state.data.searchText) < 0){
                console.log(this.state.data.get('searchText'))
                return false
              }
              else {
                return true
              }
            }
          }.bind(this))
    var bookmarks = filteredBookmarks
          .map(b => {
            return React.createElement(bookmark,
                                       {url: b.url,
                                        title: b.title,
                                        tags: b.tags,
                                        ts: b.ts})
          })
    return React.DOM.ol(null, search, title, bookmarks)
  }
})

var overseer = React.createClass({
  getInitialState : function() {
    return {
      data: Immutable.Map({welcomeText: ""})
    }
  },
  componentDidMount : function() {
    var socket = initialConnection(this.props.data.uri)
    socket.emit('ready')
    socket.on('fortune', function(msg) {
        if(this.isMounted()) {
          this.setState(({data}) => ({
            data: data.update('welcomeText', v => msg)
          }))
        }
    }.bind(this))
  },
  render : function() {
    return React.DOM.div(
      null,
      React.DOM.h3(null, this.state.data.get('welcomeText')),
      React.createElement(bookmarkList, {data: this.props.data}))
  }
})

function createRoot() {
  return React.createElement(overseer, {data: model})
}

var root = createRoot()
var container = document.body
React.render(root, container)
