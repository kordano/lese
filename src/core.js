"use strict"
var model = {bookmarks: [{title: 'The Matrix', ts: 1999, tags: ['a', 'b', 'c'], url: "google.com"},
                         {title: 'Predator', ts: 1987 , tags: ['a', 'b', 'c'], url: "google.com"},
                         {title: 'Guardians of the Galaxy', ts: 2014 , tags: ['a', 'b', 'c'], url: "google"}],
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
    var value = event.target.value
    this.setState(function(old){
      var data = old.data
      return {
        data: data.set('searchText', value)
      }
    })
  },
  findBookmark: function(data, b) {
    if (!data.get('searchText') || 0 === data.get('searchText').length) {
      return true
    } else {
      if (b.title.toLowerCase().search(data.get('searchText')) < 0) {
        return false
      }
      else {
        return true
      }
    }
  },
  render : function() {
    var title = React.DOM.h1(null, "Bookmarks")
    var data = this.state.data
    var inputElement = React.DOM.input({type: "text",
                                        placeholder: "Search ...",
                                        value: data.get('searchText'),
                                        onChange: this.handleChange})
    var bookmarks = this.props.data.bookmarks
          .filter(this.findBookmark.bind(null, data))
          .map(b => {
            return React.createElement(bookmark,
                                       {url: b.url,
                                        title: b.title,
                                        tags: b.tags,
                                        ts: b.ts})
          })
    return React.DOM.ol(null, inputElement, title, bookmarks)
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
