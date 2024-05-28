sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("sap.kt.caseproject.casestudyproject.controller.View1", {
            onInit: function () {
                this.refreshCaptcha();
            },

            refreshCaptcha: function () {
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let result = "";
                for (let i = 0; i < 6; i++) {
                    result += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                this.getView().byId("captcha2").setText(result);
            },

            // onLoginPress: function (oEvent) {

            //     var oPage = this.byId("page");
            //     oPage.setBusy(true);
            //     setTimeout(function() {
                   
                  
            //     const userId = this.getView().byId("userId").getValue();
            //     const userName = this.getView().byId("userName").getValue();
            //     const captcha1 = this.getView().byId("captcha1").getValue();
            //     const captcha2 = this.getView().byId("captcha2").getText();

                
            //     if (!this.validateUserId(userId) && !this.validateUserName(userName) && !this.validationCaptcha(captcha1,captcha2) ) {
            //         return;
            //     }
            //     if(captcha1===captcha2){
            //         this.byId("captcha1").setValueState("None");
            //     const oModel = this.getOwnerComponent().getModel();
            //     oModel.oHeaders.DataServiceVersion = '3.0';
            //     oModel.oHeaders.MaxDataServiceVersion = '3.0';

            //     oModel.read("/Persons", {
            //         filters: [
            //             new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, userId),
            //             new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.EQ, userName)
            //         ],
            //         success: function (oData) {
            //             if (oData.results.length > 0) {
            //                 const user = oData.results[0];

            //                 const oRouter = this.getOwnerComponent().getRouter();
            //                 if (user.__metadata.type === "ODataDemo.Customer") {
            //                     oRouter.navTo("RouteView2");
            //                 } else if (user.__metadata.type === "ODataDemo.Employee") {
            //                     sap.m.MessageToast.show("User not found");
            //                 } else {
            //                     oRouter.navTo("RouteView5");
            //                 }
            //             } else {
            //                 var messIDName = this.getView().getModel("i18n").getResourceBundle().getText("userNameMess")
            //                 sap.m.MessageToast.show(messIDName);
            //             }
            //         }.bind(this),
            //         error: function (error) {
            //             console.log("Error Occurred:", error);
            //         }
                    
            //     });
            //     }else{
            //         this.byId("captcha1").setValueState("Error");
            //         this.byId("captcha1").setValueStateText("Captcha Not Matched!");
            //         var captcha1mess = this.getView().getModel("i18n").getResourceBundle().getText("captchamess");
            //             sap.m.MessageToast.show(captcha1mess);
            //     }
            //     oPage.setBusy(false);
            // }, 2000);
            // },


            onLoginPress: function(oEvent) {
                var oPage = this.byId("page");
                oPage.setBusy(true);
            
                setTimeout(function() {
                    const userId = this.getView().byId("userId").getValue();
                    const userName = this.getView().byId("userName").getValue();
                    const captcha1 = this.getView().byId("captcha1").getValue();
                    const captcha2 = this.getView().byId("captcha2").getText();
            
                    if (!this.validateUserId(userId) && !this.validateUserName(userName) && !this.validationCaptcha(captcha1, captcha2)) {
                        oPage.setBusy(false);
                        return;
                    }
            
                    if (captcha1 === captcha2) {
                        this.byId("captcha1").setValueState("None");
            
                        const oModel = this.getOwnerComponent().getModel();
                        oModel.oHeaders.DataServiceVersion = '3.0';
                        oModel.oHeaders.MaxDataServiceVersion = '3.0';
            
                        oModel.read("/Persons", {
                            filters: [
                                new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, userId),
                                new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.EQ, userName)
                            ],
                            success: function(oData) {
                                // Clear the busy indicator on success
                                oPage.setBusy(false);
            
                                if (oData.results.length > 0) {
                                    const user = oData.results[0];
                                    const oRouter = this.getOwnerComponent().getRouter();
            
                                    if (user.__metadata.type === "ODataDemo.Customer") {
                                        oRouter.navTo("RouteView2");
                                    } else if (user.__metadata.type === "ODataDemo.Employee") {
                                        sap.m.MessageToast.show("User not found");
                                    } else {
                                        oRouter.navTo("RouteView5");
                                    }
                                } else {
                                    var messIDName = this.getView().getModel("i18n").getResourceBundle().getText("userNameMess")
                                    sap.m.MessageToast.show(messIDName);
                                }
                            }.bind(this),
                            error: function(error) {
                                // Clear the busy indicator on error
                                oPage.setBusy(false);
                                console.log("Error Occurred:", error);
                            }
            
                        });
                    } else {
                        this.byId("captcha1").setValueState("Error");
                        this.byId("captcha1").setValueStateText("Captcha Not Matched!");
                        var captcha1mess = this.getView().getModel("i18n").getResourceBundle().getText("captchamess");
                        sap.m.MessageToast.show(captcha1mess);
                    }
                    oPage.setBusy(false);
                }.bind(this), 2000);
            },
            
            validateUserId: function (userId) {
                if (userId === "") {
                    var userIdMess = this.getView().getModel("i18n").getResourceBundle().getText("userIdMess");
                    sap.m.MessageToast.show(userIdMess)
                    this.byId("userId").setValueState("Error");
                    this.byId("userId").setValueStateText("Enter your ID");
                    return false;
                } else {
                    this.byId("userId").setValueState("None");
                    return true;
                }
            },

            validateUserName: function (userName) {
                if (userName === "") {
                    var userNameMess = this.getView().getModel("i18n").getResourceBundle().getText("userNameMess");
                    sap.m.MessageToast.show(userNameMess)
                    this.byId("userName").setValueState("Error");
                    this.byId("userName").setValueStateText("Enter your Name");
                    return false;
                } else {
                    this.byId("userName").setValueState("None");
                    return true;
                }
            },
            validationCaptcha:function(captcha1,captcha2){
                if(captcha1===captcha2){                
                    this.byId("captcha1").setValueState("None");
                    return true;
                }else{
                    this.byId("captcha1").setValueState("Error");
                    this.byId("captcha1").setValueStateText("Captcha Not Matched!");
                    var captcha1mess = this.getView().getModel("i18n").getResourceBundle().getText("captchamess");
                        sap.m.MessageToast.show(captcha1mess);
                        return false;
                }
            },
           

        });
    });
