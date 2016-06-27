(function() {
  
  var app = angular.module('typetool', ['ngSanitize', 'LocalStorageModule']);


  ///////////////////////////////////
  // CONFIGURE LOCALSTORAGE PLUGIN //
  ///////////////////////////////////

  app.config(function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('typetool');
  });




  app.controller('StyleController', ['$scope', '$sce', '$http', 'localStorageService', function($scope, $sce, $http, localStorageService) {

    
    $scope.init = function () {
      $scope.project = localStorageService.get('project') || [];
      $scope.fontStyles = localStorageService.get('fontStyles') || [];
      $scope.base = $scope.fontStyles[0] || [];
      $scope.activeStyle = $scope.fontStyles[0] || [];
    }
    $scope.init();


    // Setup default project form JSON //
    if(!localStorageService.get('project') || !localStorageService.get('fontStyles') || !localStorageService.get('base')){

      console.log("Setting up project…");
      $http.get('/project.json')
      .success(function(data) {
        localStorageService.set('project', data['project']);
        localStorageService.set('base', data['base']);
        localStorageService.set('fontStyles', data['fontStyles']);
        $scope.init();
      })
      .error(function(data, status) {
        console.error('Loading JSON error', status, data);
      })  
    };


    // Autosave changes in fontStyles //
    $scope.$watch('fontStyles', function() {
        // do something here
        localStorageService.set('fontStyles', $scope.fontStyles);
    }, true);


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



    $scope.save = function(){
      localStorage.setItem('project', JSON.stringify($scope.project));
      localStorage.setItem('fontStyles', JSON.stringify($scope.fontStyles));
    }


    ////////////////////////////////////////////
    // Function to create CSS from fontstyles //
    ////////////////////////////////////////////

    $scope.compileStyle = function(){

      var css = '';
  

      for(var i = 0; i < $scope.fontStyles.length; i += 1){
        var style = $scope.fontStyles[i];

        css += '#'+$scope.project;

        if(style.name == "base"){
         css += style.name;
          css += '{';
          css += 'font-size:'+style.fontSize+'px;';
          css += 'line-height:'+style.lineHeight+'em;';
          css += '} ';
        } else {
          css += ' '+style.name;
          css += '{';
          css += 'font-size:'+style.fontSize+'em;';
          css += 'line-height:'+style.lineHeight+'em;';
          css += '} ';
        }
      
      }

      return css;

    };
  }]);


  /////////////////////
  // EM TO PX FILTER //
  /////////////////////
  app.filter('emtopx', function() {
    return function(value, baseSize) {
      return value * baseSize;
    }
  });


})();
