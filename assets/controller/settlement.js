/**
 * Created by lhk on 2015/9/11.
 */
myApp.controller("settlementCtrl",function ($rootScope,$scope,$cookies,$http){
    if(!$rootScope.user){
        $rootScope.loginModal.state=true;
    }else{
        $scope.getAmount = function() {
            $http.get($rootScope.config.DBUrl + "/bill/getAmount?userId="+$rootScope.user.id).success(function (doc) {
                if(doc.amount) {
                    $rootScope.billAmount = doc.amount.toFixed(2);
                }else{
                    alert('没有返回账单总额');
                }
            });
            $http.get($rootScope.config.DBUrl + "/order/getAmount?userId="+$rootScope.user.id).success(function (doc) {
                if(doc.amount) {
                    $rootScope.orderAmount = doc.amount.toFixed(2);
                }else{
                    alert('没有返回支付单总额');
                }
            });
            $rootScope.toSettleModal.show();
        };

        $scope.getSettlement = function() {
            $http.get($rootScope.config.DBUrl + "/settlement?state=0&sort=createdAt DESC&limit=1").success(function (doc) {
                if(doc[0]) {
                    console.log(doc[0].needPayList);
                    $rootScope.needPayList = doc[0].needPayList;
                    $rootScope.showSettlementModal.show();
                }else{
                    alert('暂时还没有待结算订单');
                }
            });
        };

        $scope.addSettlement = function(){
            /*$http.get($rootScope.config.DBUrl + "/settlement?state=0&sort=createdAt DESC&limit=1").success(function (doc) {//查询是否有待结账订单
                if(doc[0]){
                    alert('还有待结账订单');
                    $scope.getSettlement();
                }else{
                    $http.get($rootScope.config.DBUrl+"/settlement/goingToSettle?userId="+$rootScope.user.id).success(function (ret) {//将用户状态置于结账状态
                        if(ret.goingToSettle) {
                            $http.get($rootScope.config.DBUrl + "/settlement/addSettlement").success(function (doc) {//申请结账
                                if (doc.error) {
                                    alert(doc.error);
                                } else {
                                    if(doc.notAll){
                                        alert('已申请，还需请等待其他小伙伴申请，当前人数'+doc.needPayList.length);
                                    }else {
                                        $rootScope.toSettleModal.hide();
                                        $scope.getSettlement();
                                    }
                                }
                            });
                        }else{
                            alert(ret.error);
                        }
                    });
                }
            });*/
            alert('功能开发中...');
        };

        $scope.doneSettlement = function(){
            $http.get($rootScope.config.DBUrl+"/settlement/doneSettlement?userId="+$rootScope.user.id).success(function (ret) {
                if(ret.result){
                    if(ret.result.allDone){
                        alert('所有小伙伴已结算完成');
                    }else{
                        alert('你已成功结算，等待其他小伙伴结算');
                    }
                }else{
                    alert(ret.error);
                }
            });
        };

    }
});