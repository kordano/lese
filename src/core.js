var model = Immutable.Seq([{title: 'GI Joe', ts: 1066, tags: ['a', 'b', 'c'], url: "google.com"},
                           {title: 'GI Jane', ts: 1776 , tags: ['a', 'b', 'c'], url: "google.com"},
                           {title: 'GI Konny', ts: 666, tags: ['a', 'b', 'c'], url: "google"}]);
var uri = "localhost:8080";

socket = io.connect();
socket.on('connect', function() {
  console.log("Connected to " + uri);
});
socket.on('disconnect', function(){
  console.log("Disconnected from " + uri);
});
    
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
});

var bookmarkList = React.createClass({
  render : function() {
    var title = React.DOM.h1(null, "Bookmarks");
    var bookmarks = this.props.data.map(function (b) {
      return React.createElement(bookmark,
                                 {url: b.url,
                                  title: b.title,
                                  tags: b.tags,
                                  ts: b.ts});
    });
    return React.DOM.ol(null, title, bookmarks);
  }
});

var bookmarkInput = React.createClass({
  render : function () {
    return React.DOM.input({value: this.props.searchText, onChange: this.props.handleChange});
  }
});

var overseer = React.createClass({
  getInitialState : function() {
    return {searchText: ""};
  },
  handleChange: function(event) {
    this.setState({searchText: event.target.value});
  },
  componentDidMount : function() {
    socket.emit('ready');
    socket.on('fortune', function(data) {
      console.log(data.message);
    });
  },
  render : function() {
    var bl = React.createElement(bookmarkList, {data: this.props.data});
    var st = this.state.searchText;
    var iF = React.createElement(bookmarkInput, {searchText: st, handleChange: this.handleChange});
    return React.DOM.div(null, iF, bl);
  }
});

function createRoot() {
  return React.createElement(overseer, {data: model});
};


var root = createRoot();
var container = document.body;
React.render(root, container);
