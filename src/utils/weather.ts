const weatherUrl=process.env.WEATHER_API_URL;
const weatherApiKey=process.env.WEATHER_API_KEY;
export async function fetchWeatherData(city:string):Promise<any>{
    if(!weatherUrl || !weatherApiKey){
        throw new Error("Weather API URL or API Key is not defined in environment variables");
    }
    const url=`${weatherUrl}?q=${encodeURIComponent(city)}&appid=${weatherApiKey}&units=imetric`;
    try {
        const response=await fetch(url);
        if(!response.ok){
            throw new Error(`Failed to fetch weather data: ${response.statusText}`);
        }
        const data=await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error fetching weather data: ${(error as Error).message}`);
    }   
}