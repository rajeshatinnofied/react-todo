(function(React, module, undefined) {
  var text = 'Welcome to react to-do',
      isTodo = false,
      errorText = 'It\'s not to-do';
  module.exports = React.createClass({
    render: function() {
      var greetText = isTodo?
                      <label className="label label-primary">
                        {text}
                      </label>
                      :
                      <label className="label label-danger">
                        {errorText} 
                      </label>
                      ;
      return (
        <div className="container-fluid">
          <div className="row well">
            <h1 className="col-md-4 col-md-offset-4">
              {greetText}
            </h1>
          </div>
        </div>
      );
    }
  });
}(React, module));