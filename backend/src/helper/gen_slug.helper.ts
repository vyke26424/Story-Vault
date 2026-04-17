export function generateSlug (slug : string) {
        const short_randomUUID = crypto.randomUUID().split('-')[0];
        return slug = `${slug}-${short_randomUUID}` ;
    }