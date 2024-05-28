sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Formatter) {
        "use strict";

        return Controller.extend("sap.kt.caseproject.casestudyproject.controller.orderpayment", {
            Formatter: Formatter,
            onInit: function () {

                var countries = [{
                    "name": "India",
                    "code": "IN"
                },
                {
                    "name": "Russia",
                    "code": "RU"
                },
                {
                    "name": "China",
                    "code": "CH"
                },
                {
                    "name": "American",
                    "code": "AS"
                },
                {
                    "name": "Japan",
                    "code": "JA"
                }];
                var oModelCountry = new sap.ui.model.json.JSONModel(countries);
                this.getView().setModel(oModelCountry, "country");

                var states = [
                    {
                        "country": "IN",
                        "key": "AN",
                        "name": "Andaman and Nicobar Islands"
                    },
                    {
                        "country": "IN",
                        "key": "AP",
                        "name": "Andhra Pradesh"
                    },
                    {
                        "country": "IN",
                        "key": "AR",
                        "name": "Arunachal Pradesh"
                    },
                    {
                        "country": "IN",
                        "key": "AS",
                        "name": "Assam"
                    },
                    {
                        "country": "IN",
                        "key": "BI",
                        "name": "Bihar"
                    },
                    {
                        "country": "RU",
                        "key": "MSK",
                        "name": "Moscow"
                    },
                    {
                        "country": "RU",
                        "key": "SPB",
                        "name": "Saint Petersburg"
                    },
                    {
                        "country": "RU",
                        "key": "NSB",
                        "name": "Novosibirsk"
                    },
                    {
                        "country": "RU",
                        "key": "EK",
                        "name": "Yekaterinburg"
                    },
                    {
                        "country": "RU",
                        "key": "KC",
                        "name": "Kazan"
                    },
                    {
                        "country": "CH",
                        "key": "BJ",
                        "name": "Beijing"
                    },
                    {
                        "country": "CH",
                        "key": "SH",
                        "name": "Shanghai"
                    },
                    {
                        "country": "CH",
                        "key": "GZ",
                        "name": "Guangzhou"
                    },
                    {
                        "country": "CH",
                        "key": "SZ",
                        "name": "Shenzhen"
                    },
                    {
                        "country": "CH",
                        "key": "CD",
                        "name": "Chengdu"
                    },
                    {
                        "country": "AS",
                        "key": "NY",
                        "name": "New York"
                    },
                    {
                        "country": "AS",
                        "key": "LA",
                        "name": "Los Angeles"
                    },
                    {
                        "country": "AS",
                        "key": "CHI",
                        "name": "Chicago"
                    },
                    {
                        "country": "AS",
                        "key": "HOU",
                        "name": "Houston"
                    },
                    {
                        "country": "AS",
                        "key": "PHI",
                        "name": "Philadelphia"
                    },
                    {
                        "country": "JA",
                        "key": "TK",
                        "name": "Tokyo"
                    },
                    {
                        "country": "JA",
                        "key": "OS",
                        "name": "Osaka"
                    },
                    {
                        "country": "JA",
                        "key": "NG",
                        "name": "Nagoya"
                    },
                    {
                        "country": "JA",
                        "key": "SK",
                        "name": "Sapporo"
                    },
                    {
                        "country": "JA",
                        "key": "KY",
                        "name": "Kyoto"
                    }
                ];

                var oModelState = new sap.ui.model.json.JSONModel(states);
                this.getView().setModel(oModelState, "state");

                var oModel = this.getOwnerComponent().getModel("localModel");
                console.log(oModel);
                this.getView().setModel(oModel, "orderDetails")




                var oData = oModel.getData()
                var totalAmount = 0
                if (oData && Array.isArray(oData)) {
                    oData.forEach(function (item) {
                        totalAmount += parseFloat(item.Price)
                    })
                }
                console.log(totalAmount);
                this.getView().byId("totalAmountId").setText(totalAmount + " " + "INR")

                // this.onValidateCreditCardDetails()
                this._wizard = this.byId("productTypeWizard");

                // this.getView().byId("CreditCardStep").setVisible(false);
                this.getView().byId("BankTransferStep").setVisible(false);
                this.getView().byId("CashOnDeliveryStep").setVisible(false);


                // this.changeZipcode()
                this.address()
                this.city()
                this.onValidateAddress()
                this.CreditCardName()
                this.CreditCardSecurty()
                this.CreditCardNumber()


                this._oNavContainer = this.byId("wizardNavContainer");
            },
            setProductTypeFromRadio: function (oEvent) {
                var selectedText =oEvent.mParameters.selectedIndex
                this.oWizard = this.byId("CreateProductWizard").getSteps()[1].setValidated(false);
                if (selectedText === 0) {
                    this.getView().byId("CreditCardStep").setVisible(true);
                    this.getView().byId("BankTransferStep").setVisible(false);
                    this.getView().byId("CashOnDeliveryStep").setVisible(false);
                    this.onValidateCreditCardDetails()
                } else if (selectedText === 1) {
                    this.getView().byId("BankTransferStep").setVisible(true);
                    this.getView().byId("CashOnDeliveryStep").setVisible(false);
                    this.getView().byId("CreditCardStep").setVisible(false);
                    this.oWizard = this.byId("CreateProductWizard").getSteps()[1].setValidated(true);
                } else {
                    this.getView().byId("CashOnDeliveryStep").setVisible(true);
                    this.getView().byId("CreditCardStep").setVisible(false);
                    this.getView().byId("BankTransferStep").setVisible(false);
                    this.onValidateCashOnDelivery()

                }
            },
            onSubmit: function () {
                this.onValidateCreditCardDetails()
                var date = new Date().getTime();
                var random = Math.floor(Math.random() * 9000) + 1000;
                var orderId = date.toString() + random.toString();
                console.log(orderId);
                var submitbutton = this.getView().getModel("i18n").getResourceBundle().getText("Submitbutton")
                sap.m.MessageBox.success(submitbutton + "  " + orderId, {
                    onClose: function () {
                        var oRouter = this.getOwnerComponent().getRouter();
                        oRouter.navTo("RouteView2");
                        this.getOwnerComponent().getModel().refresh()
                    }.bind(this)
                });
                setTimeout(function () {
                    var oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("RouteView2");
                    location.reload();
                }.bind(this), 5000);
            },
            CreditCardSecurty: function () {
                var sCreditSecurityValue = this.byId("creditsecurty").getValue();
                var regexSecurityCode = /^\d{3}$/;
                if (!regexSecurityCode.test(sCreditSecurityValue)) {
                    this.byId("creditsecurty").setValueState("Error");
                    this.byId("creditsecurty").setValueStateText("Enter a valid 3-digit security code");
                    this.bValid = false;
                } else {
                    this.byId("creditsecurty").setValueState("None");
                }
            },
            CreditCardNumber: function () {
                var oCreditNumberInput = this.byId("creditnumber").getValue();
                var regexCreditNumber = /^\d{16}$/;
                if (!regexCreditNumber.test(oCreditNumberInput)) {
                    this.byId("creditnumber").setValueState("Error");
                    this.byId("creditnumber").setValueStateText("Enter a valid 16-digit number");
                    this.bValid = false;
                } else {
                    this.byId("creditnumber").setValueState("None");
                }
            },
            CreditCardName: function () {
                var oCreditNameInput = this.byId("creditname").getValue();
                if (oCreditNameInput === "") {
                    this.byId("creditname").setValueState("Error");
                    this.byId("creditname").setValueStateText("Enter the Value");
                    this.bValid = false;
                } else {
                    this.byId("creditname").setValueState("None");
                }
            },


            // firstname: function () {
            //     var sFirstNameValue = this.byId("firstname").getValue();
            //     if (sFirstNameValue === "") {
            //         this.byId("firstname").setValueState("Error");
            //         this.byId("firstname").setValueStateText("Enter the Value");
            //         bValid = false;
            //     } else {
            //         this.byId("firstname").setValueState("None");
            //     }
            // },
            // lastname: function () {
            //     var sLastNameValue = this.byId("lastname").getValue();
            //     if (sLastNameValue === "") {
            //         this.byId("lastname").setValueState("Error");
            //         this.byId("lastname").setValueStateText("Enter the Value");
            //         bValid = false;
            //     } else {
            //         this.byId("lastname").setValueState("None");
            //     }
            // },
            // phonenumber: function () {
            //     var sPhoneNumberValue = this.byId("phonenumber").getValue();
            //     var regexPhoneNumber = /^\d{10}$/;
            //     if (!regexPhoneNumber.test(sPhoneNumberValue)) {
            //         this.byId("phonenumber").setValueState("Error");
            //         this.byId("phonenumber").setValueStateText("Enter a valid 10-digit phone number");
            //         bValid = false;
            //     } else {
            //         this.byId("phonenumber").setValueState("None");
            //     }
            // },
            // emailid: function () {
            //     var sEmailValue = this.byId("email").getValue();
            //     var regexEmail = /^\S+@\S+\.\S+$/;
            //     if (!regexEmail.test(sEmailValue)) {
            //         this.byId("email").setValueState("Error");
            //         this.byId("email").setValueStateText("Enter a valid email address");
            //         bValid = false;
            //     } else {
            //         this.byId("email").setValueState("None");
            //     }
            // },


            phonenumber22222: function () {
                var sPhoneNumberValue = this.byId("phonenumber2").getValue();
                var regexPhoneNumber = /^\d{10}$/;
                if (!regexPhoneNumber.test(sPhoneNumberValue)) {
                    this.byId("phonenumber2").setValueState("Error");
                    this.byId("phonenumber2").setValueStateText("Enter a valid 10-digit phone number");
                    bValid = false;
                } else {
                    this.byId("phonenumber2").setValueState("None");
                }
            },

            //live Chnage event credit card number
            onCreditNumberChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                sValue = sValue.replace(/\D/g, '');
                if (sValue.length > 16) {
                    sValue = sValue.substring(0, 16);
                }
                oInput.setValue(sValue);
                if (sValue.length === 16) {
                    this.byId("creditnumber").setValueState("None");
                };
            },

            crditSecurtyNumber: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                sValue = sValue.replace(/\D/g, '');
                if (sValue.length > 3) {
                    sValue = sValue.substring(0, 3);
                }
                oInput.setValue(sValue);
                if (sValue.length === 3) {
                    this.byId("creditsecurty").setValueState("None");
                }
            },

            phonenumberlivechange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                sValue = sValue.replace(/\D/g, '');
                if (sValue.length > 10) {
                    sValue = sValue.substring(0, 10);
                }
                oInput.setValue(sValue);
                if (sValue.length === 10) {
                    this.byId("phonenumber2").setValueState("None");
                    this.byId("phonenumber").setValueState("None");
                } else {
                    this.byId("phonenumber2").setValueState("Error");
                    this.byId("phonenumber").setValueState("Error");
                }
            },

            onValidateCreditCardDetails: function () {
                // Validate Cardholder's Name
                var bValid = true;
                var oCreditNameInput = this.byId("creditname").getValue();
                if (oCreditNameInput === "") {
                    this.byId("creditname").setValueState("Error");
                    this.byId("creditname").setValueStateText("Enter the Value");
                    bValid = false;
                } else {
                    this.byId("creditname").setValueState("None");
                }

                // Validate Card Number
                var oCreditNumberInput = this.byId("creditnumber").getValue();
                var regexCreditNumber = /^\d{16}$/;
                if (!regexCreditNumber.test(oCreditNumberInput)) {
                    this.byId("creditnumber").setValueState("Error");
                    this.byId("creditnumber").setValueStateText("Enter a valid 16-digit number");
                    bValid = false;
                } else {
                    this.byId("creditnumber").setValueState("None");
                }

                var sCreditSecurityValue = this.byId("creditsecurty").getValue();
                var regexSecurityCode = /^\d{3}$/;
                if (!regexSecurityCode.test(sCreditSecurityValue)) {
                    this.byId("creditsecurty").setValueState("Error");
                    this.byId("creditsecurty").setValueStateText("Enter a valid 3-digit security code");
                    bValid = false;
                } else {
                    this.byId("creditsecurty").setValueState("None");
                }
                this.oWizard = this.byId("CreateProductWizard").getSteps()[1].setValidated(bValid);
            },

            onValidateCashOnDelivery: function () {
                var bValid = true;
                var sFirstNameValue = this.byId("firstname").getValue();
                var sLastNameValue = this.byId("lastname").getValue();
                var sPhoneNumberValue = this.byId("phonenumber").getValue();
                var sEmailValue = this.byId("email").getValue();

                // Validate First Name
                if (sFirstNameValue === "") {
                    this.byId("firstname").setValueState("Error");
                    this.byId("firstname").setValueStateText("Enter the Value");
                    bValid = false;
                } else {
                    this.byId("firstname").setValueState("None");
                }

                // Validate Last Name
                if (sLastNameValue === "") {
                    this.byId("lastname").setValueState("Error");
                    this.byId("lastname").setValueStateText("Enter the Value");
                    bValid = false;
                } else {
                    this.byId("lastname").setValueState("None");
                }

                // Validate Phone Number
                var regexPhoneNumber = /^\d{10}$/;
                if (!regexPhoneNumber.test(sPhoneNumberValue)) {
                    this.byId("phonenumber").setValueState("Error");
                    this.byId("phonenumber").setValueStateText("Enter a valid 10-digit phone number");
                    bValid = false;
                } else {
                    this.byId("phonenumber").setValueState("None");
                }

                // Validate Email Id
                var regexEmail = /^\S+@\S+\.\S+$/;
                if (!regexEmail.test(sEmailValue)) {
                    this.byId("email").setValueState("Error");
                    this.byId("email").setValueStateText("Enter a valid email address");
                    bValid = false;
                } else {
                    this.byId("email").setValueState("None");
                }

                // Set the validation state of the wizard step
                this.byId("CreateProductWizard").getSteps()[1].setValidated(bValid);
            },

            onValidateAddress: function () {
                // Validate Address
                var bValid = true;
                var sAddressValue = this.byId("address").getValue();
                if (sAddressValue === "") {
                    this.byId("address").setValueState("Error");
                    this.byId("address").setValueStateText("Enter your street name and house number");
                    bValid = false;

                } else {
                    this.byId("address").setValueState("None");
                }

                // Validate City
                var sCityValue = this.byId("city").getValue();
                if (sCityValue === "") {
                    this.byId("city").setValueState("Error");
                    this.byId("city").setValueStateText("Enter your city");
                    bValid = false;
                } else {
                    this.byId("city").setValueState("None");
                }

                var sPhoneNumberValue = this.byId("phonenumber2").getValue();
                var regexPhoneNumber = /^\d{10}$/;
                if (!regexPhoneNumber.test(sPhoneNumberValue)) {
                    this.byId("phonenumber2").setValueState("Error");
                    this.byId("phonenumber2").setValueStateText("Enter a valid 10-digit phone number");
                    bValid = false;
                } else {
                    this.byId("phonenumber2").setValueState("None");
                }
            },
            address: function () {
                var sAddressValue = this.byId("address").getValue();
                if (sAddressValue === "") {
                    this.byId("address").setValueState("Error");
                    this.byId("address").setValueStateText("Enter your street name and house number");
                } else {
                    this.byId("address").setValueState("None");
                }
            },
            city: function () {
                var sCityValue = this.byId("city").getValue();
                if (sCityValue === "") {
                    this.byId("city").setValueState("Error");
                    this.byId("city").setValueStateText("Enter your city");
                } else {
                    this.byId("city").setValueState("None");
                }
            },

            ReturnToShop: function () {
                this.getOwnerComponent().getModel().refresh()
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteView2")
            },
            onPressReview: function () {
                // var oPage = this.byId("wizardReviewPage");
                // oPage.setBusy(true);
                // setTimeout(function(){
                var sAddressValue = this.byId("address").getValue();
                var sCityValue = this.byId("city").getValue();
                var sZipCodeValue = this.byId("phonenumber2").getValue();
                if (sAddressValue === "" && sCityValue === "" && sZipCodeValue === "") {
                    sap.m.MessageBox.show("Fill the all address details")
                } else {
                    this.getView().byId("Creditcard").setVisible(false);
                    this.getView().byId("BankTrnasfer").setVisible(false);
                    this.getView().byId("CashOnDelivery").setVisible(false);

                    this._oNavContainer.to(this.byId("wizardReviewPage"));

                    var view = this.getView();

                    var totalAmount = view.byId("totalAmountId").getText();

                    var CreditCard = view.byId("creditCardRadio").getSelected();
                    var BankTransfer = view.byId("bankTransferRadio").getSelected();
                    var cashOnDeliveryRadio = view.byId("cashOnDeliveryRadio").getSelected();

                    var formData = {};

                    if (CreditCard === true) {
                        this.getView().byId("Creditcard").setVisible(true);
                        formData.paymentMethod = "CreditCard";
                        formData.name = view.byId("creditname").getValue();
                        formData.number = view.byId("creditnumber").getValue();
                        formData.security = view.byId("creditsecurty").getValue();
                        formData.expiration = view.byId("expirationDate").getValue();
                    } else if (BankTransfer === true) {
                        this.getView().byId("BankTrnasfer").setVisible(true);
                        formData.paymentMethod = "BankTransfer";
                        formData.beneficiaryName = "Singapore Hardware e-Commerce LTD";
                        formData.bank = "CITY BANK, SINGAPORE BRANCH";
                        formData.accountNumber = "06110702027218";
                    } else if (cashOnDeliveryRadio === true) {
                        this.getView().byId("CashOnDelivery").setVisible(true);
                        formData.paymentMethod = "CashOnDelivery";
                        formData.firstName = view.byId("firstname").getValue();
                        formData.lastName = view.byId("lastname").getValue();
                        formData.phoneNumber = view.byId("phonenumber").getValue();
                        formData.email = view.byId("email").getValue();
                    }

                    formData.address = view.byId("address").getValue();
                    formData.city = view.byId("city").getValue();
                    formData.zipcode = view.byId("phonenumber2").getValue();
                    formData.country = this.byId("countrySelect").getSelectedItem().mProperties.text
                    formData.state = this.byId("stateSelect").getSelectedItem().mProperties.text

                    var Data = [];

                    Data.push(formData);

                    var wizart = new sap.ui.model.json.JSONModel(Data)
                    this.getView().setModel(wizart, "wizartdata")

                    var orderDetailsModel = this.getView().getModel("localModel")
                    for (var i = 0; i < orderDetailsModel.getData().length; i++) {
                        this.getView().setModel(orderDetailsModel.getData()[i], "orderDetails")
                    }
                }
                //     oPage.setBusy(false)
                // }.bind(this),3000)
            },

            onChange2: function (oEvent) {
                var selectedCountry = oEvent.getParameter("selectedItem").getKey()

                var oValue = new sap.ui.model.Filter("country", sap.ui.model.FilterOperator.EQ, selectedCountry);
                this.getView().byId("stateSelect").getBinding("items").filter(oValue)
            },
            Logout: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteView1");
            },

            validateForm: function () {
                var bValid = true;

                // Validate first name
                var sFirstNameValue = this.byId("firstname").getValue();
                if (sFirstNameValue === "") {
                    this.byId("firstname").setValueState("Error");
                    this.byId("firstname").setValueStateText("Enter the Value");
                    bValid = false;
                } else {
                    this.byId("firstname").setValueState("None");
                }

                // Validate last name
                var sLastNameValue = this.byId("lastname").getValue();
                if (sLastNameValue === "") {
                    this.byId("lastname").setValueState("Error");
                    this.byId("lastname").setValueStateText("Enter the Value");
                    bValid = false;
                } else {
                    this.byId("lastname").setValueState("None");
                }

                // Validate phone number
                var sPhoneNumberValue = this.byId("phonenumber").getValue();
                var regexPhoneNumber = /^\d{10}$/;
                if (!regexPhoneNumber.test(sPhoneNumberValue)) {
                    this.byId("phonenumber").setValueState("Error");
                    this.byId("phonenumber").setValueStateText("Enter a valid 10-digit phone number");
                    bValid = false;
                } else {
                    this.byId("phonenumber").setValueState("None");
                }
                // Validate email
                var sEmailValue = this.byId("email").getValue();
                var regexEmail = /^\S+@\S+\.\S+$/;
                if (!regexEmail.test(sEmailValue)) {
                    this.byId("email").setValueState("Error");
                    this.byId("email").setValueStateText("Enter a valid email address");
                    bValid = false;
                } else {
                    this.byId("email").setValueState("None");
                }

                this.oWizard = this.byId("CreateProductWizard").getSteps()[1].setValidated(bValid);

            },

            firstname: function () {
                this.validateForm();
            },

            lastname: function () {
                this.validateForm();
            },

            phonenumber: function () {
                this.validateForm();
            },

            emailid: function () {
                this.validateForm();
            },
            validateForm2: function () {
                var bValid = true;
                var oCreditNameInput = this.byId("creditname").getValue();
                if (oCreditNameInput === "") {
                    this.byId("creditname").setValueState("Error");
                    this.byId("creditname").setValueStateText("Enter the Value");
                    bValid = false;
                } else {
                    this.byId("creditname").setValueState("None");
                }

                var oCreditNumberInput = this.byId("creditnumber").getValue();
                var regexCreditNumber = /^\d{16}$/;
                if (!regexCreditNumber.test(oCreditNumberInput)) {
                    this.byId("creditnumber").setValueState("Error");
                    this.byId("creditnumber").setValueStateText("Enter a valid 16-digit number");
                    bValid = false;
                } else {
                    this.byId("creditnumber").setValueState("None");
                }

                var sCreditSecurityValue = this.byId("creditsecurty").getValue();
                var regexSecurityCode = /^\d{3}$/;
                if (!regexSecurityCode.test(sCreditSecurityValue)) {
                    this.byId("creditsecurty").setValueState("Error");
                    this.byId("creditsecurty").setValueStateText("Enter a valid 3-digit security code");
                    bValid = false;
                } else {
                    this.byId("creditsecurty").setValueState("None");
                }
                var sCreditDateValue = this.byId("expirationDate").getValue();
                if (sCreditDateValue === "") {
                    this.byId("expirationDate").setValueState("Error");
                    this.byId("expirationDate").setValueStateText("Enter a valid Date");
                    bValid = false;
                } else {
                    this.byId("expirationDate").setValueState("None");
                }
                this.oWizard = this.byId("CreateProductWizard").getSteps()[1].setValidated(bValid);
            },

            crditSecurtyNumber: function () {
                this.validateForm2()
            },
            onCreditNumberChange: function () {
                this.validateForm2()
            },
            creditcardlivename: function () {
                this.validateForm2()
            },
            expirationDateChange:function(){
                this.validateForm2()
            }
        });
    });

