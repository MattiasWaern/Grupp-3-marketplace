// @ts-nocheck
module.exports = (config, { strapi }) => {
    return async (ctx, next) => {
        await next();
        
        if (ctx.request.method === 'POST' && ctx.request.url.includes('/api/listings')) {
            const user = ctx.state.user;
            
            if (user && ctx.response.body?.data?.documentId) {
                const documentId = ctx.response.body.data.documentId;
                
                await strapi.documents('api::listing.listing').update({
                    documentId,
                    status: 'published',
                    data: { 
                        user: user.documentId
                    }
                });
                
                console.log("User kopplad till annons:", documentId);
            }
        }
    };
};