module.exports = {
    async beforeCreate(event) {
        const { params } = event;
        
        const documentId = params?.data?.createdBy || null;
        console.log("LIFECYCLE PARAMS:", JSON.stringify(params.data, null, 2));
    }
};