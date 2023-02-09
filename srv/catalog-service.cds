using {s4hOP.MO.db as db} from '../db/schema';

namespace s4hOP.MO.srv;

service catalogService @(path : '/catalog') {

    entity MaintenanceOrder          as select * from db.MaintenanceOrder;
    entity MaintenanceOrderOperation as select * from db.MaintenanceOrderOperation;
    function getOrder() returns array of String;
}
