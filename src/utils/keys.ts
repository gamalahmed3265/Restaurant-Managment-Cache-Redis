
export function getKeyName(...args:string[]):string{
    return args.join(":");
}

export function getRestaurantKey(restaurantId:string):string{
    return getKeyName("restaurant",restaurantId);
}