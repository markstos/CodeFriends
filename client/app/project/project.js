/*global angular:true, CodeMirror:true */
/*jshint browser:true */
'use strict';
angular.module('code.project', ['ui.router'])
  .controller('projectController', function ($scope, $state, $stateParams, $http, Auth, Files, documentFactory) {
      Auth.isLoggedIn();
      $scope.files = [];

      $scope.getAllFiles = function () {
        return $http.get('/api/project/' + $stateParams.projectName)
          .then(function (res) {
            $scope.files = res.data.files;
            console.log('$scope.files!!', $scope.files);
            return $scope.files;
          });
      };

      $scope.goToHome = function () {
        $state.go('home');
      };

      $scope.addNewFile = function () {
        return Files.addNewFile($scope.newFileName, $stateParams.projectName)
          .then(function (files) {
            console.log('Files:', files);
            $scope.files = files;
            var cm = CodeMirror.fromTextArea(document.getElementById('pad'), {
              mode: 'javascript',
              value: 'function(){}',
              lineNumbers: true,
              matchBrackets: true,
              theme: 'solarized dark'
            });
            documentFactory.goToDocument($scope.newFileName, $stateParams.projectName, cm);
          });
      };
      Files.getAllFiles($stateParams.projectName)
        .then(function (files) {
          console.log('Files:', files);
          $scope.files = files;
        });

      return $http.post('/api/file', {
          file_name: $scope.newFileName,
          project_name: $stateParams.projectName,
          type: 'file',
          parent_file: null
        })
        .then(function () {
          console.log('Created New File');
          return $scope.getAllFiles();
        });
    }; $scope.getAllFiles();
  });