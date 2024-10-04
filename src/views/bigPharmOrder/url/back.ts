export const orderBloodBack = {
    GET_ALL: '/Command/',
    GET_ORDER_BLOOD: '/Command/list_all_order_on_specific_pharmacy/',
    GET_DRUG_BY_ID: '/Command/:id/get_by_id_Command_with_drugs_order/',
    GET_ODER_HISTORY_BY_ID: '/Command/:id/all_history_about_order/',
    GET_ONE: '/Command/{id}/',
    CREATE: '/Command/',
    UPDATE: '/Command/{id}/',
    DELETE: '/Command/{id}/',
    CHANGE_ORDER_STATUT: '/Command/{id}/change_Command_state/',
    CANCEL_ORDER: '/Command/{id}/Cancel_Command/',
    GENERATE_FILE: '/Command/{id}/generate_order_file/',
    PUT: '/Command/{id}/soft_delete/',
}