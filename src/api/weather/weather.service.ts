import axios from "axios";

import { tokens } from "@constants";
import { geocoderService } from "@api/geocoder";
import { formWeatherUrl, transformWeatherData } from "@helpers";

class WeatherService {
	private apiKey: string;

	constructor() {
		this.apiKey = tokens.weatherApiToken;
	}

	async getCurrWeather(location: string) {
		const { geoData, error } = await geocoderService.getCoordinates(location, this.apiKey);
		if (error) return { data: null, error };

		const { data } = await axios.get(formWeatherUrl(geoData?.lat, geoData?.lon, this.apiKey));
		const transformedData = transformWeatherData(geoData?.name, data);
		return { data: transformedData, error: null };
	}
}

export const weatherService = new WeatherService();