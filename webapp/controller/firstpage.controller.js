sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Formatter) {
        "use strict";

        return Controller.extend("sap.kt.caseproject.casestudyproject.controller.firstpage", {
            Formatter: Formatter,
            onInit: function () {
                this.Categories()
                this.localModel = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().setModel(this.localModel, "localModel");
            },
            Categories: function () {
                var oModel = this.getOwnerComponent().getModel();
                oModel.oHeaders.DataServiceVersion = '3.0'
                oModel.oHeaders.MaxDataServiceVersion = '3.0'
                oModel.read("/Categories", {
                    success: function (oData) {
                        var oDataModel = new sap.ui.model.json.JSONModel(oData.results)
                        this.getView().setModel(oDataModel, "Categories")
                    }.bind(this),
                    error: function (error) {
                        console.log(error);
                    }
                })
            },
            onPressGoToProduct: function (oEvent) {
                var oPage = this.byId("page");
                oPage.setBusy(true);
                setTimeout(function(){
                var sPath = oEvent.getSource().getBindingContext("Categories").getPath();

                sPath = sPath.slice(1);
                console.log(sPath);

                var oModel = this.getOwnerComponent().getModel();
                oModel.oHeaders.DataServiceVersion = '3.0';
                oModel.oHeaders.MaxDataServiceVersion = '3.0';

                oModel.read("/Categories", {
                    filters: [new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, sPath)],
                    urlParameters: { "$expand": "Products" },
                    success: function (oData) {
                        // console.log(oData);
                        var jsondata = new sap.ui.model.json.JSONModel(oData.results[0].Products.results);
                        this.getView().setModel(jsondata, "product");
                    }.bind(this),
                    error: function (error) {
                        console.log("Error while fetching products:", error);
                    }
                });
                oPage.setBusy(false)
            }.bind(this),2000)
            },
            handleAddToCart: function (oEvent) {
                var aSelectedItems = oEvent.getParameter("listItems"); 
                var aProducts = [];
            
                aSelectedItems.forEach(function (oListItem) {
                    var oProduct = oListItem.getBindingContext("product").getObject();
                    aProducts.push(oProduct);
                });
                var addtocart = this.getView().getModel("i18n").getResourceBundle().getText("addtocart");
                var sMessage = addtocart;
                aProducts.forEach(function(oProduct) {
                    sMessage += oProduct.Name + ", ";
                });
            
                sap.m.MessageToast.show(sMessage);
            
                var localModel = this.getOwnerComponent().getModel("localModel");
                var data = localModel.getData();
                if (!Array.isArray(data)) {
                    data = [];
                }
            
                aProducts.forEach(function(oProduct) {
                    var samedata = data.some(function(item){
                        return item.ID === oProduct.ID
                    })
                    if(!samedata){
                        data.push({
                            "ID": oProduct.ID,
                            "Name": oProduct.Name,
                            "Description": oProduct.Description,
                            "Price": oProduct.Price,
                            "Rating": oProduct.Rating
                        });
                    }
                    });
                   
            
                localModel.setData(data);
                localModel.refresh();
            },
            
            OpenAddToCart: function () {
                var oPage = this.byId("page");
                oPage.setBusy(true);
                setTimeout(function() {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteView3")
                oPage.setBusy(false)
                }.bind(this),2000);
            },
            Logout:function(){
                var oRouter = this.getOwnerComponent().getRouter();
                        oRouter.navTo("RouteView1");
            }
        });
    });

