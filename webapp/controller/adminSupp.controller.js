sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("sap.kt.caseproject.casestudyproject.controller.adminSupp", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteView6").attachMatched(this._onRouteMatched, this);
            },
            _onRouteMatched:function(oEvent){
                var expID = oEvent.getParameter("arguments").ID;
                var sPath = "/Products(" + expID + ")/Supplier"
                var oModel = this.getOwnerComponent().getModel()
                
                oModel.oHeaders.DataServiceVersion = '3.0'
                oModel.oHeaders.MaxDataServiceVersion = '3.0'
                oModel.read(sPath,{
                    success:function(oData){
                        console.log(oData);
                        var jsondata = new sap.ui.model.json.JSONModel(oData)
                        this.getView().setModel(jsondata,"Suppliers")
                    }.bind(this),
                    error:function(error){
                        console.log(error);
                    }
                })
            },
            
            OnUpdateSupplier: function(oEvent) {
                var oButton = oEvent.getSource();
                this.sSupplierId = oButton.data("id");


                var oView = this.getView()
                if (!this.oUpdateSupp) {
                    this.oUpdateSupp = sap.ui.core.Fragment.load({
                        name: "sap.kt.caseproject.casestudyproject.fragment.supplier",
                        controller: this
                    }).then(function (oUpdateSupp) {
                        this.oUpdateSupp = oUpdateSupp;
                        oView.addDependent(this.oUpdateSupp);
                        this.oUpdateSupp.open();
                        
                    }.bind(this));
                } else {
                    this.oUpdateSupp.open();
                   
                }

            },
            updateSupplierClose:function(){
                this.oUpdateSupp.close();
            },
            updateSupplierSave:function(){
                var url = "/Suppliers("+ this.sSupplierId+")"
                var oModel = this.getOwnerComponent().getModel()

                var name = sap.ui.getCore().byId("name2").getValue()
                var city = sap.ui.getCore().byId("City").getValue()
                var street = sap.ui.getCore().byId("Street").getValue()
                var state = sap.ui.getCore().byId("State").getValue()
                var zipcode = sap.ui.getCore().byId("ZipCode").getValue()
                var country = sap.ui.getCore().byId("Country").getValue()

                var oPlayload = {
                    "odata.metadata": "Suppliers",
                    "Name":name,
                    "Address":{
                        "City":city,
                        "Street":street,
                        "State":state,
                        "ZipCode":zipcode,
                        "Country":country,
                    }                    
                }
                oModel.bUseBatch = false;

                oModel.update(url,oPlayload,{
                    success:function(odata){
                        console.log(odata);
                        sap.m.MessageBox.success("Updated Successfully !");
                        this.getOwnerComponent().getModel().refresh();
                        this.getOwnerComponent().getModel().refresh()
                    }.bind(this),
                    error:function(error){
                        sap.m.MessageBox.error("Failed Update !", error);
                    }
                })
            },

            OnDeleteSupplier : function(oEvent){
                // var id = oEvent.getSource().getCustomData()[0].getValue();
                // console.log(id);
                var url = "Suppliers("+this.id+")"
                var oModel = this.getOwnerComponent().getModel()
                oModel.oHeaders.DataServiceVersion = '3.0'
                oModel.oHeaders.MaxDataServiceVersion = '3.0'
                oModel.bUseBatch = false;
                oModel.remove(url, {
                    success: function (oData) {
                        sap.m.MessageBox.success("Deleted successfully");
                        this.getOwnerComponent().getModel().refresh();
                    }.bind(this),
                    error: function (error) {
                        console.log(error);
                        sap.m.MessageBox.error("Deletion failed: ");
                    }
                });
            },
            
        });
    });

