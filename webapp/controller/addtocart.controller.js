sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Formatter) {
        "use strict";

        return Controller.extend("sap.kt.caseproject.casestudyproject.controller.addtocart", {
            Formatter:Formatter,
            onInit: function() {
                var oModel = this.getOwnerComponent().getModel("localModel");
                console.log(oModel);
                this.getView().setModel(oModel,"addtocartModel")

            },
            onPressOrder : function(){
                var oPage = this.byId("page");
                oPage.setBusy(true);
                setTimeout(function(){
                var oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("RouteView4")
                    oPage.setBusy(false)
                }.bind(this),2000)
            },
            ReturnToShop:function(){
                var oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("RouteView2")
            },
            Logout:function(){
                var oRouter = this.getOwnerComponent().getRouter();
                        oRouter.navTo("RouteView1");
            }
        });
    });

    