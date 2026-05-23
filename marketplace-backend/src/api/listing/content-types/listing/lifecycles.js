module.exports = {
    async beforeCreate(event) {
        const { params, state } = event;
        
        if (state?.auth?.credentials?.id) {
            params.data.user = state.auth.credentials.id;
        }
    }
};