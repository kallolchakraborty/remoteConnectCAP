using {s4hOP.MO.db as db} from '../db/schema';

namespace s4hOP.MO.srv;

service catalogService @(path : '/catalog') {

    entity MaintenanceOrder          as select * from db.MaintenanceOrder;
    entity MaintenanceOrderOperation as select * from db.MaintenanceOrderOperation;
    /**
     * function: getOrder(): to fetch Work Order from destination via Cloud Connector
     * function: getOrderDiff(): to fetch the differences between S4H & BTP 
     */
    function getOrder()     returns array of String;
    function getOrderDiff() returns array of String;
}
