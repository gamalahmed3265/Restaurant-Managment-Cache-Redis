
export function getKeyName(...args:string[]):string{
    return `redis:${args.join(":")}`;
}
// export const restaurantKey="restaurant"
export function getRestaurantKey(restaurantId:string):string{
    return getKeyName("restaurant",restaurantId);
}

export const reviewKeyById=(reviewId:string):string=>getKeyName("review",reviewId);

export const reviewsDetailsKeyByID=(restaurantId:string):string=>getKeyName("review_details",restaurantId);


export const cuisinesKey=getKeyName("cuisines");

export const cuisinesKeyByName=(cuisineName:string):string=>getKeyName("cuisine",cuisineName);

export const restaurantByCuisineKeyByID=(id:string):string=>getKeyName("cuisine_restaurants",id);

export const restaurantsByRatingKey=getKeyName("restaurants_by_rating")