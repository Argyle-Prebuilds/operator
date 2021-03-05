export const LOGIN_INITIAL_STATE = {
    email: "",
    password: "",
};

export const PASSWORD_RESET_INITIAL_STATE = {
    email: "",
};

export const PASSWORD_INITIAL_STATE = {
    password: "",
    password_confirmed: "",
};

export const HOMEPAGE_SETTINGS_INITIAL = {
    html_text: '',
    logo: null,
    show_button: true,
    button_text: ''
}

export const USER_EDITS_SETTINGS_INITIAL = {
    logo: '',
    header: '',
    body: '',
    button_text: '',
    subject: ''
}

export const SMS_INVITATION_LINK_CODE = "[Invitation Link]";

export const GENERATOR_ACCOUNT_INITIAL_STATE = {
    routing_number: '',
    account_number: '',
    allocation_type: '',
    allocation_value: '',
    account_type: ''
}

export const GENERATOR_INITIAL_STATE = {
    user_full_name: "",
    user_email: "",
    user_phone_number: "",
    data_partner_id: "",
    pay_distribution_data: GENERATOR_ACCOUNT_INITIAL_STATE
}

export const OPTIONAL_GENERATOR_FIELDS = {
    send_text_message: false,
    set_integration: false,
    run_deposit_changed: false,
}

export const PAGINATION_INITIAL_STATE = {
    page: 1,
    pageCount: 0,
    itemsPerPage: 5,
}


export const LinkedAccountStatus = {
    ADDED: 1,
    CONNECTED: 2,
    FAILED: 3,
    REMOVED: 4
}

export const LinkedPayAllocationStatus = {
    ADDED: 1,
    UPDATED: 2,
    REMOVED: 3
}
