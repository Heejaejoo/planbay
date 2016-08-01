'use strict';
angular.module('planBay')
    .constant("baseURL","http://localhost:3000/");
// example
//        .service('menuFactory', ['$resource','baseURL', function($resource,baseURL){
//
 //                this.getDishes = function(){
  //                  return $resource(baseURL+"dishes/:id",null,
  //                    {'update':{method:'PUT'}});
   //             };
   //             this.getPromo = function(){
    //                return $resource(baseURL+"promotions/:id", null);
     //           };
      //  }])
