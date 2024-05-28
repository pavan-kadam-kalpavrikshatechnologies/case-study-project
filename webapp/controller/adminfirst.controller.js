sap.ui.define([
    "sap/ui/core/mvc/Controller",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("sap.kt.caseproject.casestudyproject.controller.adminfirst", {
            onInit: function () {
                this.Categories()
            },
            Categories:function(){
                var oModel = this.getOwnerComponent().getModel()
                oModel.oHeaders.DataServiceVersion = '3.0'
                oModel.oHeaders.MaxDataServiceVersion = '3.0'
                oModel.read("/Categories",{
                    success:function(oData){
                        var jsondata = new sap.ui.model.json.JSONModel(oData.results)
                        this.getView().setModel(jsondata,"Categories")
                    }.bind(this),error: function(error){
                        console.log(error)
                    }
                })
            },
            onPressGoToAdminProduct:function(oEvent){
                this.sPath = oEvent.getSource().getBindingContext("Categories").getPath()
                var sPath = this.sPath.slice(1)
                this.sPath2 = sPath
                
                var oModel = this.getOwnerComponent().getModel()
                
                oModel.oHeaders.DataServiceVersion = '3.0'
                oModel.oHeaders.MaxDataServiceVersion = '3.0'

                oModel.read("/Categories",{
                    filters:[new sap.ui.model.Filter("ID",sap.ui.model.FilterOperator.EQ,sPath)],
                    urlParameters: { "$expand": "Products" },
                    success:function(oData){
                        var jsonModel = new sap.ui.model.json.JSONModel(oData.results[0].Products.results)
                        this.getView().setModel(jsonModel,"product")
                    }.bind(this),error:function(error){
                        console.log(error);
                    }
                })
            },
            OnUpdateProduct:function(oEvent){
                this.sPath =  oEvent.getSource().getBindingContext("product").getObject().ID
                // this.proId = sPath

                this.ID = oEvent.getSource().getBindingContext("product").getObject().ID
                var name = oEvent.getSource().getBindingContext("product").getObject().Name
                var desc = oEvent.getSource().getBindingContext("product").getObject().Description
                var rating = oEvent.getSource().getBindingContext("product").getObject().Rating
                var price = oEvent.getSource().getBindingContext("product").getObject().Price
                var date = oEvent.getSource().getBindingContext("product").getObject().ReleaseDate
                console.log(name);
                var oView = this.getView()
                if (!this.oUpdate) {
                    this.oUpdate = sap.ui.core.Fragment.load({
                        name: "sap.kt.caseproject.casestudyproject.fragment.admin",
                        controller: this
                    }).then(function (oUpdate) {
                        this.oUpdate = oUpdate;
                        oView.addDependent(this.oUpdate);
                        this.oUpdate.open();
                        sap.ui.getCore().byId("productsname").setValue(name)
                        sap.ui.getCore().byId("desc").setValue(desc)
                        sap.ui.getCore().byId("rating").setValue(rating)
                        sap.ui.getCore().byId("price").setValue(price)
                       
                    }.bind(this));
                } else {
                    this.oUpdate.open();
                    sap.ui.getCore().byId("productsname").setValue(name)
                    sap.ui.getCore().byId("desc").setValue(desc)
                    sap.ui.getCore().byId("rating").setValue(rating)
                    sap.ui.getCore().byId("price").setValue(price)
                }
            },
            updateProductClose:function(){
                this.oUpdate.close();
            },
            updateProductSave: function() {
                var oModel = this.getOwnerComponent().getModel();
                this.url = "/Products(" + this.sPath+ ")";
                
                var name = sap.ui.getCore().byId("productsname").getValue();
                var desc = sap.ui.getCore().byId("desc").getValue();
                var rating = sap.ui.getCore().byId("rating").getValue();
                var price = sap.ui.getCore().byId("price").getValue();
                
                var oPayLoad = {
                    "odata.type": "ODataDemo.FeaturedProduct",
                    "Name": name,
                    "Description": desc,
                    "Price": price,
                    "Rating": rating
                };
                
                oModel.setUseBatch(false); 
                oModel.update(this.url, oPayLoad, {
                    success: function(oData) {
                        console.log(oData);                        
                            this.oUpdate.close();                         
                        sap.m.MessageBox.success("Updated Successfully!");
                        this.genericMethod("/Categories("+this.sPath2+ ")/Products");
                    }.bind(this), 
                    error: function(error) {
                        sap.m.MessageBox.error("Failed Update!")
                        console.log(error);
                    }.bind(this)
                });
            },
            
            genericMethod: function (sPath) {
                var oModel2 = this.getOwnerComponent().getModel();
                oModel2.read(sPath, {
                    success: function (oData) {
                        console.log(oData);
                        
                        var oJSONModel =  new sap.ui.model.json.JSONModel(oData.results);
                        this.getView().setModel(oJSONModel, "product");
                    }.bind(this),
                    error: function (oError) {
                        console.log(oError);
                    }
                });
            },




            OnDeleteProduct:function(oEvent){
                var sPath =  oEvent.getSource().getBindingContext("product").getObject().ID
                var url = "/Products("+sPath+")"
                var oModel = this.getOwnerComponent().getModel()
                
                oModel.bUseBatch = false;
                oModel.remove(url,{
                    success:function(odata){
                        console.log(odata);
                        sap.m.MessageBox.success("Deleted successfully");
                        this.genericMethod2();
                    }.bind(this),
                    error:function(error){sap.m.MessageBox.error("Deleted Failed",error);}
                })
            },

            genericMethod2: function () {
                var oModel2 = this.getOwnerComponent().getModel();
                oModel2.read("/Categories("+this.sPath2+")", {
                    filters:[new sap.ui.model.Filter("ID",sap.ui.model.FilterOperator.EQ,this.sPath2)],
                    urlParameters: { "$expand": "Products" },
                    success: function (oData) {
                        console.log(oData);
                        var data = Object.assign({},[oData.results])
                        var oJSONModel =  new sap.ui.model.json.JSONModel(data);
                        this.getView().setModel(oJSONModel, "product");
                    }.bind(this),
                    error: function (oError) {
                        console.log(oError);
                    }
                });
            },
            goToSuppliers: function(oEvent){
                var sPath = oEvent.getSource().getBindingContext("product").oModel.oData[0].ID
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteView6", {
                    ID: sPath
                });
            },
            
        });
    });

