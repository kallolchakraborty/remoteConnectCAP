using {s4hOP.MO.db as db} from '../db/schema';

namespace s4hOP.MO.srv;

service catalogService @(path : '/catalog') {

    @odata.draft.enabled
    entity MaintenanceOrder          as select * from db.MaintenanceOrder;

    entity MaintenanceOrderOperation as select * from db.MaintenanceOrderOperation;

}
