const cds = require("@sap/cds");
/** sap-cf-axios: to make calls via the destinations */
const sapcfaxios = require("sap-cf-axios").default;
var jsonDiff = require('json-diff');
module.exports = cds.service.impl(async (srv) => {

    /** function: getOrderDiff */
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

    /** function: getOrderDiff */
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

        /** CAP entity defined in the schema.cds */
        const { MaintenanceOrder } = srv.entities;
        /** SELECT query with WHERE */
        let lt_BTP_MaintenanceOrder = await SELECT.from(MaintenanceOrder);
        console.log(`No. of entries(MaintenanceOrder) BTP:-------> ${lt_BTP_MaintenanceOrder.length}`);
        /** differences */
        console.log(`Differences:-------> ${lt_S4H_MaintenanceOrder.length - lt_BTP_MaintenanceOrder.length}`);

        //let [lt_data_01, lt_data_02] = [createData(lt_S4H_MaintenanceOrder, 1), createData(lt_BTP_MaintenanceOrder, 2)];

        /** finding the difference between the array of objects: lt_BTP_MaintenanceOrder: ID, lt_S4H_MaintenanceOrder: MaintenanceOrder */
        /** some instead of find can be used */
        return lt_S4H_MaintenanceOrder.filter(e => !lt_BTP_MaintenanceOrder.find(a => e.MaintenanceOrder === a.ID));
    });


    // function createData(lv_obj, lv_flag) {
    //     let [lt_data, lv_record] = [[], {}];
    //     for (let key in lv_obj) {
    //         /** creating the record */
    //         if (lv_flag === 1) {
    //             lv_record = {
    //                 ID: lv_obj[key]['MaintenanceOrder'],
    //                 MaintenanceOrderType: lv_obj[key]['MaintenanceOrderType'],
    //                 MaintenanceOrderDesc: lv_obj[key]['MaintenanceOrderDesc'],
    //                 controllingArea: lv_obj[key]['controllingArea'],
    //                 mainWorkCenter: lv_obj[key]['mainWorkCenter']
    //             };
    //         }
    //         else {
    //             lv_record = {
    //                 ID: lv_obj[key]['ID'],
    //                 MaintenanceOrderType: lv_obj[key]['MaintenanceOrderType'],
    //                 MaintenanceOrderDesc: lv_obj[key]['MaintenanceOrderDesc'],
    //                 controllingArea: lv_obj[key]['controllingArea'],
    //                 mainWorkCenter: lv_obj[key]['mainWorkCenter']
    //             };
    //         }
    //         /** appending */
    //         lt_data.push(lv_record);
    //     }
    //     return lt_data;
    // }

    /** function: workOrderUpdate */
    srv.on("workOrderUpdate", async (req) => {
        /** database connect */
        const db = await cds.connect.to("db");
        /** entities */
        const { MaintenanceOrder } = db.entities;

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
        const lt_S4H_MaintenanceOrder = response.data.d.results;

        /** data fetch from the BTP HANA Cloud */
        let lt_BTP_MaintenanceOrder = await SELECT.from(MaintenanceOrder);

        /** finding the difference between the array of objects: lt_BTP_MaintenanceOrder: ID, lt_S4H_MaintenanceOrder: MaintenanceOrder */
        let lt_diff = lt_S4H_MaintenanceOrder.filter(e => !lt_BTP_MaintenanceOrder.find(a => e.MaintenanceOrder === a.ID));

        let lt_data = [];
        for (let lv_key in lt_diff) {
            if (lt_diff.hasOwnProperty(lv_key)) {
                /** creating the record */
                let lv_record = {
                    ID: lt_diff[lv_key]['MaintenanceOrder'],
                    MaintenanceOrderType: lt_diff[lv_key]['MaintenanceOrderType'],
                    MaintenanceOrderDesc: lt_diff[lv_key]['MaintenanceOrderDesc'],
                    controllingArea: lt_diff[lv_key]['controllingArea'],
                    mainWorkCenter: lt_diff[lv_key]['mainWorkCenter']
                };
                /** appending */
                lt_data.push(lv_record);
            }
        }

        if (lt_data.length != 0) {
            const lv_result = await db.run(INSERT(lt_data).into(MaintenanceOrder));
            /** database commit */
            db.tx(req).commit();
            console.log(lv_result);
            return 'Load finished'
        }
        else
            return 'No records to upload';
    });
});

