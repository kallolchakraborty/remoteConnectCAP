using {s4hOP.MO.db as db} from '../db/schema';

namespace s4hOP.MO.srv;

/**
 * setting path of the service & the custom handlers url: <https://cap.cloud.sap/docs/node.js/services#srv-impls>
 */

service catalogService @(path : '/catalogService') @(impl : './custom-handlers.js') {

    /**
     * control exposure of associations and compositions: hiding of
     * the entities having associations
     */
    annotate MaintenanceOrder with {
        modifiedAt @odata.etag
    }
    entity MaintenanceOrder          as projection on db.MaintenanceOrder excluding {
        maintenanceOrderOperation
    };

    entity MaintenanceOrderOperation as projection on db.MaintenanceOrderOperation;
    /**
     * functions:
     */
    function getOrder()        returns array of String;
    function getOrderDiff()    returns array of String;
    function workOrderUpdate() returns array of String;
}
