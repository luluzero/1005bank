/**
 * Created by lhk on 2015/9/11.
 */
myApp.controller("payFormCtrl",function ($rootScope,$scope,$cookies,$http){
    if(!$rootScope.user){
        $rootScope.loginModal.state=true;
    }else{
        if(!$rootScope.cacheDate.userList){
            $http.get($rootScope.config.DBUrl+"/user?group=1005").success(function (data) {
                $rootScope.cacheDate.userList = data;
            });
        }
        //模态框内选择参与人
        $scope.selectJoinPay = {
            userList:$rootScope.cacheDate.userList,
            selectJoin:function(){
                console.log('selectJoin');
                $rootScope.cacheDate.userList = $scope.selectJoinPay.userList;
                $rootScope.cacheDate.joinPayList = [];
                $scope.selectJoinPay.userList.forEach(function(e){
                    if(e.select){
                        $rootScope.cacheDate.joinPayList.push(e);
                    }
                });
                $rootScope.joinPayModal.hide();
            }
        }

        //记账表单
        $scope.payForm = {
            title:'',
            pic:'',
            money:'',
            joinPayList:[],
            ok:function(){
                $rootScope.cacheDate.joinPayList.forEach(function(e){
                    $scope.payForm.joinPayList.push({id: e.id, name: e.name});
                });
                $http.post($rootScope.config.DBUrl+"/order",{title:$scope.payForm.title,money:$scope.payForm.money,joinPayList:$scope.payForm.joinPayList,payUser:$rootScope.user.id}).success(function (data) {
                    if(data){
                        alert('记账成功');
                        data.joinPayList.forEach(function(each){
                            $http.post($rootScope.config.DBUrl+"/bill",{orderId:data.id,title:data.title,money:ItoDecimal2(data.money/data.joinPayList.length),joinPayList:$scope.payForm.joinPayList,billUser:each.id}).success(function (result) {
                                if(result) {
                                    console.log('生成账单成功');
                                }
                            });
                        });
                    }
                });
            }
        }
    }
    function ItoDecimal2(number) {
        return Math.round(number * Math.pow(10,2))/Math.pow(10,2);
    }
});