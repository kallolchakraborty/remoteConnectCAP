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

        /** CAP entity defined in the schema.cds */
        // const { MaintenanceOrderOperation } = srv.entities;
        /** SELECT query with WHERE */
        // let lt_operations = await SELECT.from(MaintenanceOrderOperation).where({ MAINTENANCEORDER_ID: '1000441'});
        // console.log(`No. of entries(MaintenanceOrderOperation):-------> ${lt_operations.length}`);
        // console.log(typeof(lt_operations));

        /** return */
        return response.data.d.results;
        // return lt_operations;
    });
});