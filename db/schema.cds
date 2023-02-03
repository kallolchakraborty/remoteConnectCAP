namespace s4hOP.MO.db;

entity MaintenanceOrder {
        maintenanceOrderType      : String(4);
        maintenanceOrderDesc      : String(100);
        controllingArea           : String(4);
        mainWorkCenter            : String(8);
    key ID                        : String(8);
        maintenanceOrderOperation : Composition of many MaintenanceOrderOperation
                                        on maintenanceOrderOperation.maintenanceOrder = $self;
}

entity MaintenanceOrderOperation {
    key maintenanceOrderOperation : String(4);
        operationDescription      : String(100);
    key maintenanceOrder          : Association to one MaintenanceOrder;
}
