(function(React, _) {  
  var render = function() {
  	var App = require('./components/app.jsx')
	ReactDOM.render(React.createElement(App), document.body);
  };
  render();
}(React, _));
