
sap.ui.define([], function() {
    "use strict";
    return {
        date: function(sDate) {
            if (!sDate) {
                return "";
            }
            var oDate = new Date(sDate);
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "yyyy-MM-dd" 
            });
            return oDateFormat.format(oDate);
        },
        currency: function(sPrice) {
            return parseFloat(sPrice).toFixed(2) + " INR"; 
        }
    };
});
