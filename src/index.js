/**
 * Created by jane on 3/5/16.
 */
// main.js
var React = require('react');
var ReactDOM = require('react-dom');
var names = ['jane', 'joe', 'crystal'];
var titles = [
    'It\'s Work!',
    'awesome'
];
ReactDOM.render(
    <div>
        {titles}
    </div>,

    document.getElementById('example')
);

// component
// make sure first letter of class name be uppercase
// prop validation  http://facebook.github.io/react/docs/reusable-components.html
// getDefaultProps
var HelloMsg = React.createClass({
    getDefaultProps: function(){
        return {
            phone: '13512345678'
        }
    },
    propTypes: {
        name: React.PropTypes.string.isRequired
    },
    render: function(){
        return <h1 className= {this.props.class}>hello, {this.props.name}, {this.props.phone}</h1>
    }
});

ReactDOM.render(
    <HelloMsg name = "115" class = "component-a" />,
    document.getElementById('classDemo')
);



// this.props.children
// having no child: undefined
// having only one child: object
// having two or more children: array
var NotesList = React.createClass({
    render: function() {
        return (
            <ol>
      {
          React.Children.map(this.props.children, function (child) {
              return <li>{child}</li>;
          })
          }
            </ol>
        );
    }
});

ReactDOM.render(
    <NotesList>
        <span>hello</span>
        <span>world</span>
    </NotesList>,
    document.getElementById('listDemo')
);

//this.state状态

var Timer = React.createClass({
  getInitialState: function() {
    return {secondsElapsed: 0};
  },
  tick: function() {
    this.setState({secondsElapsed: this.state.secondsElapsed + 1});
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    return (
      <div>Seconds Elapsed: {this.state.secondsElapsed}</div>
    );
  }
});

ReactDOM.render(<Timer />, document.getElementById('ButtonDemo'));


//comment_data
var data = [
  {author:"fuwenfang",text:"fuwenfang comments"},
  {author:"kaungwen",text:"kuangwen comments"},
];

//my comment

var Comment = React.createClass({
  render:function(){
    return (
        <div className = "comments">
            <h2 className= "commentsAuthor">
                {this.props.author}
            </h2>
            {this.props.children}
        </div>
    )
  }
})

//my commentList
var CommentList = React.createClass({
    render:function(){
        var commentNodes = this.props.data.map(function(commentdata){
            return <Comment author = {commentdata.author}>{commentdata.text}</Comment>
        })
        return (
            <div className = "CommentList">
            Hello, world! I am a CommentList.
                {commentNodes}
            </div>
        );
    }
});


//my commentForm
var CommentForm = React.createClass({
    getInitialState:function(){
        return {
          value:''
        }
    },
    handleSubmit: function(e) {   
        e.preventDefault();
        var author = this.refs.author.value.trim();
        var text = this.refs.text.value.trim();
        //this.refs.author.getDOMNode() 直接获取到组件的 DOM 节点。
        this.refs.author.getDOMNode().focus();//点击post之后获得焦点
        if (!text || !author) {
          return;
        }
        this.props.onCommentSubmit({author: author, text: text});
        this.refs.author.value = '';
        this.refs.text.value = '';
        return;
    },
    handleChange:function(e){
        this.setState({value:e.target.value.substr(0,5)});
    },
    render:function(){
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
              <input type="text"  placeholder="maxLength 5" ref="author" value={this.state.value} onChange = {this.handleChange}/>
              <input type="text" placeholder="Say something..." ref="text" />
              <input type="submit" value="Post" />
              <input type="radio" name="opt" defaultChecked /> Option 1
              <input type="radio" name="opt" /> Option 2
              <select select defaultvalue="B">
                <option value="A">Apple</option>
                <option value="B">Banana</option>
                <option value="C">Cranberry</option>
              </select>
            </form>
        );
    }
});


//my commentBox  ajax动态请求comments数据接口
/*
**props 是不可变的：它们从父组件传递过来，“属于”父组件。
 为了实现交互，我们给组件引入了可变的 state 。this.state 是组件私有的，
 可以通过调用 this.setState() 来改变它。当 state 更新之后，组件就会重新渲染自己。
*/
var CommentBox = React.createClass({
  getInitialState:function(){
      return {data:[]};
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit :function(comment){
    //TO DO ajax to server and refresh the list
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'Get',
      data: comment,
      success: function(data) {
        console.log(data);
        this.setState({data: data});//根据返回data数据更新this.state进而更新UI
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data = {this.state.data}/>
        <CommentForm onCommentSubmit = {this.handleCommentSubmit}/>
      </div>
    );
  }
});
ReactDOM.render(
  <CommentBox url ="../comments.json" />,
  document.getElementById('content')
);

/**
*commentList 是从父组件将listdata传递给子组件进行展示(this.state.data)
*commentForm 是从子组件把newcommentdata传给父组件进行ajax请求(绑定回调函数)
*/

var LikedShow = React.createClass({
  getInitialState:function(){
    return {
      liked:false
    }
  },
    handleClick:function(){
      return this.setState({liked:this.state.liked?false:true});
    },

    render:function(){
      var text = this.state.liked?'I liked':'I have not liked';
      return (
          <p onClick = {this.handleClick}>{text}</p>

        )
    }

});
ReactDOM.render(<LikedShow />,document.getElementById('LikedDemo'));

//props 的spread{...this.props} 可以把props的所有属性都传递进来
//{...other}

var CheackClick = React.createClass({
    render : function(){
      return (
          <a {...this.props}>{this.props.children}</a>

      )
    }
});
ReactDOM.render(
    <CheackClick href = "http://www.baidu.com">
        click me!
    </CheackClick>,document.getElementById('LinkDemo')
  )

/*react实现一个定时器 一个组件需要定期更新  React 提供 生命周期方法 来告知组件创建或销毁的时间。
下面来做一个简单的 mixin，使用 setInterval() 并保证在组件销毁时清理定时器。*/
var SetIntervalMixin = {
  //componentWillMount()在挂载发生之前立即被调用。
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  //componentWillUnmount()在组件移除和销毁之前被调用。清理工作应该放在这里。
  componentWillUnmount: function() {
    this.intervals.map(clearInterval);
  }
};

var TimeClick = React.createClass({
    mixins: [SetIntervalMixin], // 引用 mixin
    getInitialState:function(){
      return {myseconds:0}
    },
    tick : function(){
        this.setState({myseconds:this.state.myseconds+1});
    },
    //componentDidMount()在挂载结束之后马上被调用。需要DOM节点的初始化操作应该放在这里。
    componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000); // 调用 mixin 的方法
  },
  
    render:function(){
      return (
          <p>the seconds is {this.state.myseconds}</p>
      )
    }

});
ReactDOM.render(
    <TimeClick />,document.getElementById('TimeDemo')
  );


