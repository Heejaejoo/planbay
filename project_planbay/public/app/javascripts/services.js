/*global angular*/
'use strict';
angular.module('planBay')
       .constant("baseURL","https://planbay-heejae-joo.c9users.io/")
       .service('planFactory', ['$resource','baseURL', function($resource, baseURL){
                 this.getPlans = function(){
                    return $resource(baseURL+"plans/:id",null,
                      {'update':{method:'PUT'}});
                };
        }])
        
        .service('wunderAccessFactory', ['$resource','baseURL', function($resource, baseURL){
                 this.getTokens = function(){
                     var token = $resource(baseURL+"wunderlists/getcode");
                     console.log(token);
                     return token;
                };
        }])
        
        ;
