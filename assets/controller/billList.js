/**
 * Created by lhk on 2015/9/11.
 */
myApp.controller("billListCtrl",function ($rootScope,$scope,$cookies,$http){

    if(!$rootScope.user){
        $rootScope.loginModal.state=true;
    }else{
        $scope.page = 1;
        $scope.busy = false;
        $scope.loadMore=function(){
            if(!$scope.busy) {
                $scope.busy = true;
                $http.get($rootScope.config.DBUrl + "/bill?sort=createdAt DESC&limit=10&skip=" + $scope.page * 10 + "&billUser=" + $rootScope.user.id).success(function (data) {
                    if (data) {
                        data.forEach(function (e) {
                            e.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm');
                            $scope.billList.push(e);
                        });
                    }
                    $scope.page++;
                    $scope.busy = false;
                });
            }
        };

        $http.get($rootScope.config.DBUrl+"/bill?sort=createdAt DESC&limit=10&billUser="+$rootScope.user.id).success(function (data) {
            if(data){
                data.forEach(function(e){
                    e.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm');
                });
                $scope.billList = data;
            }
        });
    }
});
