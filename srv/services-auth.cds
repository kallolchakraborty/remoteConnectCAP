/**
 * using service namespace
 */
using {s4hOP.MO.srv} from './catalog-service';

// annotate srv.catalogService.MaintenanceOrder with @(requires : 'authenticated-user');

annotate srv.catalogService.MaintenanceOrderOperation with @(restrict : [
    {
        grant : ['WRITE'],
        to    : 'admin'
    },
    {
        grant : 'READ',
        where : 'createdBy = $user'
    },
]);

annotate srv.catalogService.MaintenanceOrder with @(requires : 'admin');
annotate srv.catalogService.getOrder with @(requires : 'admin');
annotate srv.catalogService.getOrderDiff with @(requires : 'admin');
annotate srv.catalogService.workOrderUpdate with @(requires : 'admin');
