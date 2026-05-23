module.exports = (config, { strapi }) => {
    return async (ctx, next) => {
        await next();
        
        if (ctx.request.method === 'POST' && ctx.request.url.includes('/api/listings')) {
            const user = ctx.state.user;
            console.log("USER EFTER NEXT:", user?.username);
            
            if (user && ctx.response.body?.data?.documentId) {
                const documentId = ctx.response.body.data.documentId;
                
                // Uppdatera annonsen med user efter att den skapats
                await strapi.documents('api::listing.listing').update({
                    documentId,
                    data: { user: user.documentId }
                });
                
                console.log("User kopplad till annons:", documentId);
            }
        }
    };
};