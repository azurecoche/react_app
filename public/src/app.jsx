// var React = require('react');
// var ReactDOM = require('react-dom');

var App1 = React.createClass({
    render: function(){
        return(
            <div>
                <h1>This is App 1 part</h1>
            </div>
        );
    }
});

ReactDOM.render(
    <App1 />,
    document.getElementById('app1')
);
