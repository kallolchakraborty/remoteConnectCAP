namespace s4hOP.MO.db;

/**
 * aspects: url: <https://cap.cloud.sap/docs/cds/common#aspect-managed>
 */
using {managed} from '@sap/cds/common';

entity MaintenanceOrder : managed {
        maintenanceOrderType      : String(4);
        maintenanceOrderDesc      : String(100);
        controllingArea           : String(4);
        mainWorkCenter            : String(8);
    key ID                        : String(8);
        maintenanceOrderOperation : Composition of many MaintenanceOrderOperation
                                        on maintenanceOrderOperation.maintenanceOrder = $self;
}

entity MaintenanceOrderOperation : managed {
    key maintenanceOrderOperation : String(4);
        operationDescription      : String(100);
    key maintenanceOrder          : Association to one MaintenanceOrder;
}
