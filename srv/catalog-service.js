const cds = require("@sap/cds");
/** sap-cf-axios: to make calls via the destinations */
const sapcfaxios = require("sap-cf-axios").default;

module.exports = cds.service.impl(async (srv) => {

    /** function: getOrder */
    srv.on("getOrder", async (req) => {

        const axios = sapcfaxios("DST030");
        console.log("Entering the GET req of MaintenanceOrder:--------->");
        /** the destination is having basic authentication */
        const response = await axios({
            method: "GET",
            url: "/API_MAINTENANCEORDER/MaintenanceOrder",
            params: {
                $format: "json",
            },
            headers: {
                accept: "application/json",
            },
        });

        /** return */
        return response.data.d.results;
    });

    /** function: getOrder */
    srv.on("getOrderDiff", async (req) => {

        /** the destination: MaintenanceOrderCPI is having OAuth2ClientCredentials authentication */
        const axios = sapcfaxios("MaintenanceOrderCPI");
        let authorization = req.headers.authorization;

        /** POST method */
        const response = await axios({
            method: "POST",
            url: "/http/STO/MaintenanceOrderInput",
            params: {
                "$format": "json"
            },
            headers: {
                "content-type": "application/json",
                authorization
            },
            /** payload */
            data: {
                "MaintenancePlanningPlant": "1710",
                "MaintenanceOrderType": "ZSTO",
                "MainWorkCenter": "RES-0200",
            }
        });

        console.log(`No. of entries(MaintenanceOrder) S4H:-------> ${response.data.d.results.length}`);
        const lt_S4H_MaintenanceOrder = response.data.d.results;
        // console.log(lt_S4H_MaintenanceOrder);

        /** CAP entity defined in the schema.cds */
        const { MaintenanceOrder } = srv.entities;
        /** SELECT query with WHERE */
        let lt_BTP_MaintenanceOrder = await SELECT.from(MaintenanceOrder).where({ ID: '1000441' });
        console.log(`No. of entries(MaintenanceOrder) BTP:-------> ${lt_BTP_MaintenanceOrder.length}`);
        console.log(`Differences:-------> ${lt_S4H_MaintenanceOrder.length - lt_BTP_MaintenanceOrder.length}`);

        let lt_diff = {};
        /** Object.keys(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys */
        /** The Object.keys() static method returns an array of a given object's own enumerable string-keyed property names. */
        let lv_keys = Object.keys(lt_BTP_MaintenanceOrder);
        for (let lv_key in lt_S4H_MaintenanceOrder) {
            /** Array.includes(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes */
            /** The includes() method determines whether an array includes a certain value among its entries, returning true or false as appropriate */
            if (!lv_keys.includes(lv_key)) {
                lt_diff[lv_key] = lt_S4H_MaintenanceOrder[lv_key];
            }
        }
        return lt_diff;
    });
});