import { ConfigService } from "@config";
import {
	formAttractionsApiUrl,
	formCityGeoUrl,
	formEventsApiUrl,
	formFoodApiUrl,
	transformAttractionsData,
	transformFoodData,
} from "@helpers";
import axios from "axios";

class GuidanceService {
	constructor() {
		this._opentripApiKey = new ConfigService().get("OPENTRIP_API_KEY");
		this._eventsApiKey = new ConfigService().get("EVENTS_API_KEY");
	}

	async getAttractions(city) {
		try {
			const { lat, lon, name } = await this.#getCityCoords(city);
			const { data } = await axios.get(
				formAttractionsApiUrl(lat, lon, this._opentripApiKey)
			);

			return {
				data: transformAttractionsData(name, data.features),
				error: null,
			};
		} catch {
			return { data: null, error: "Oops attractions not found🤕!" };
		}
	}

	async getFoodPlaces(city) {
		try {
			const { lat, lon, name } = await this.#getCityCoords(city);

			const { data } = await axios.get(
				formFoodApiUrl(lat, lon, this._opentripApiKey)
			);

			return {
				data: transformFoodData(name, data.features),
				error: null,
			};
		} catch {
			return { data: null, error: "Oops food places not found🤕!" };
		}
	}

	async getEvents(city) {
		try {
			const { country } = await this.#getCityCoords(city);

			const { data } = await axios.get(formEventsApiUrl(country), {
				headers: {
					"X-Api-Key": this._eventsApiKey,
				},
			});

			return { data: { city, result: data }, error: null };
		} catch (error) {
			return {
				data: null,
				error: "Oops!Events in such country not found🤕",
			};
		}
	}

	async #getCityCoords(city) {
		const { data } = await axios.get(
			formCityGeoUrl(city, this._opentripApiKey)
		);
		return data;
	}
}

export const guidanceService = new GuidanceService();