
export function getKeyName(...args:string[]):string{
    return args.join(":");
}

export function getRestaurantKey(restaurantId:string):string{
    return getKeyName("restaurant",restaurantId);
}

export const reviewKeyById=(reviewId:string):string=>getKeyName("review",reviewId);

export const reviewsDetailsKeyByID=(restaurantId:string):string=>getKeyName("review_details",restaurantId);