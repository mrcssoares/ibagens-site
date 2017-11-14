angular.module("ibagens", []);

angular.module("ibagens").value('config', {
    serverUrl: "http://localhost:9005"
});

angular.module("ibagens").controller("ibagensCtrl", function($scope, $window, $http, config) {
    if(localStorage.getItem('login') == 'true') {
        $scope.login = true
    }else {
        $scope.login = false;
    }

    if($scope.login && window.location.pathname != '/bent/data-user.html'){
        window.location = '/bent/data-user.html';
    }else if(!$scope.login && window.location.pathname == '/bent/data-user.html'){
        window.location = '/bent/index.html';
    }

    $scope.user = JSON.parse(localStorage.getItem('user-ibagens'));

    if(!$scope.login) {
        setTimeout(function () {
            document.getElementById('video').play();
            console.log('indo nessa')
        }, 3000);
    }

    $scope.cadastro = function (nome, email, password) {
        $http({
            method: "POST",
            url: config.serverUrl + "/users",
            headers: {
                'Content-Type': 'application/json',
            },
            data:{
                'name': nome,
                'email': email,
                'password': password
            }
        }).then(function mySuccess(response) {
            if(confirm('usuário cadastrado com sucesso, agora é necessário fazer login, deseja fazer login agora?')) {
                $('#login').trigger('click');
            }
        }, function myError(response) {
            alert('Verifique os dados!')
        });
    }

    /*
    * teewa2@gmail.com.br
    * senhacriptografada2
    * */

    $scope.entrar = function (email, password) {
        $http({
            method: "POST",
            url: config.serverUrl + "/users/login",
            headers: {
                'Content-Type': 'application/json',
            },
            data:{
                'email': email,
                'password': password
            }
        }).then(function mySuccess(response) {
            console.log(response.data);
            localStorage.setItem('login', 'true');
            localStorage.setItem('user-ibagens', JSON.stringify(response.data))
            window.location = '/bent/data-user.html';
        }, function myError(response) {
            alert('Verifique os dados!')
        });
    }

    $scope.requestImagens = function (token) {
        console.log(token);
        $http({
            method: "get",
            url: config.serverUrl + "/imgs/me",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(function mySuccess(response) {
            console.log(response.data);
            $scope.imagens = response.data;
        }, function myError(response) {
            console.log(response)
        });
    }

    $scope.limit = 3;
    $scope.vermais = function () {
        $scope.limit = $scope.limit + 3;
    }


    if($scope.user){
        $scope.requestImagens($scope.user.user.token)
    }

    $scope.sair = function () {
        localStorage.removeItem('login');
        location.reload();
    }

});