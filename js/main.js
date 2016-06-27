(function() {
  
  var app = angular.module('typetool', ['ngSanitize']);




  app.controller('StyleController', ['$scope', '$sce', '$http', function($scope, $sce, $http) {

    
    $scope.project = project;
    $scope.fontStyles = [];
    $scope.activeStyle = [];


   
    $http.get('/project.json')
    .success(function(data) {
      $scope.fontStyles = data;
      $scope.activeStyle = $scope.fontStyles[0];
    })
    .error(function(data, status) {
      console.error('Loading JSON error', status, data);
    })
    


    $scope.initEditor = function(id){
      for(var i = 0; i < $scope.fontStyles.length; i += 1){
        var fontStyle = $scope.fontStyles[i];
        if(id === id){
            return fontStyle;
        }
      }
    }

    $scope.isActive = function(id) {
      return $scope.activeStyle.id === id;
    };

    $scope.editStyle = function(style){
      $scope.activeStyle = $scope.fontStyles[style.id];
    };






    ////////////////////////////////////////////
    // Function to create CSS from fontstyles //
    ////////////////////////////////////////////

    $scope.compileStyle = function(){

      var css = '';
      
      for(var i = 0; i < $scope.fontStyles.length; i += 1){
        
        var style = $scope.fontStyles[i];

        css += '#'+project.title;

        if (style.name != "body"){
          css += ' '+style.name;
        }

        css += '{';
        css += 'font-size:'+style.fontSize+'em;';
        css += 'line-height:'+style.lineHeight+'em;';
        css += '} ';
      
      }

      return css;

    };
  }]);





  // VARIABELS
  var project = {
    title: "test-project"
  };

})();
