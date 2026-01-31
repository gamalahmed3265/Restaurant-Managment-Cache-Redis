
export function getKeyName(...args:string[]):string{
    return `redis:${args.join(":")}`;
}
// export const restaurantKey="restaurant"

// Restaurant Keys
export function getRestaurantKey(restaurantId:string):string{
    return getKeyName("restaurant",restaurantId);
}
export const restaurantDetailsKeyById=(id:string):string=>getKeyName("restaurant_details",id);
export const restaurantsByRatingKey=getKeyName("restaurants_by_rating");
export const indexKey=getKeyName("idx","restaurants")
// Review Keys
export const reviewKeyById=(reviewId:string):string=>getKeyName("review",reviewId);
export const reviewsDetailsKeyByID=(restaurantId:string):string=>getKeyName("review_details",restaurantId);

// Cuisine Keys
export const cuisinesKey=getKeyName("cuisines");
export const cuisinesKeyByName=(cuisineName:string):string=>getKeyName("cuisine",cuisineName);
export const restaurantByCuisineKeyByID=(id:string):string=>getKeyName("cuisine_restaurants",id);

// Weather Keys
export const weatherKeyById=(id:string):string=>getKeyName("weather",id);