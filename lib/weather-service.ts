// Weather service for OpenWeather API integration

const API_KEY = "6ec0d8125d1790d4dd1aceb266025c91"
const BASE_URL = "https://api.openweathermap.org/data/2.5"

export interface WeatherData {
  location: {
    name: string
    country: string
    lat: number
    lon: number
  }
  current: {
    temp: number
    feels_like: number
    humidity: number
    wind_speed: number
    weather: {
      id: number
      main: string
      description: string
      icon: string
    }
    clouds: number
    visibility: number
    dt: number
  }
  forecast: Array<{
    dt: number
    temp: {
      day: number
      min: number
      max: number
    }
    weather: {
      id: number
      main: string
      description: string
      icon: string
    }
    pop: number // Probability of precipitation
  }>
}

export async function getWeatherByCoordinates(
  lat: number,
  lon: number,
  units: "metric" | "imperial" = "imperial",
): Promise<WeatherData> {
  try {
    // Get current weather
    const currentResponse = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`)

    if (!currentResponse.ok) {
      throw new Error(`Weather API error: ${currentResponse.statusText}`)
    }

    const currentData = await currentResponse.json()

    // Get 5-day forecast
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast/daily?lat=${lat}&lon=${lon}&units=${units}&cnt=5&appid=${API_KEY}`,
    )

    let forecastData

    if (forecastResponse.ok) {
      forecastData = await forecastResponse.json()
    } else {
      // Fallback to mock forecast data if the endpoint fails
      forecastData = {
        list: Array(5)
          .fill(null)
          .map((_, i) => ({
            dt: Math.floor(Date.now() / 1000) + i * 86400,
            temp: {
              day: Math.round(currentData.main.temp + (Math.random() * 10 - 5)),
              min: Math.round(currentData.main.temp - Math.random() * 5),
              max: Math.round(currentData.main.temp + Math.random() * 5),
            },
            weather: [currentData.weather[0]],
            pop: Math.random() * 0.5,
          })),
      }
    }

    // Format the data
    return {
      location: {
        name: currentData.name,
        country: currentData.sys.country,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
      },
      current: {
        temp: Math.round(currentData.main.temp),
        feels_like: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        wind_speed: Math.round(currentData.wind.speed),
        weather: currentData.weather[0],
        clouds: currentData.clouds.all,
        visibility: currentData.visibility,
        dt: currentData.dt,
      },
      forecast: forecastData.list.map((day: any) => ({
        dt: day.dt,
        temp: {
          day: Math.round(day.temp.day),
          min: Math.round(day.temp.min),
          max: Math.round(day.temp.max),
        },
        weather: day.weather[0],
        pop: Math.round(day.pop * 100), // Convert to percentage
      })),
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw error
  }
}

export async function getWeatherByCity(city: string, units: "metric" | "imperial" = "imperial"): Promise<WeatherData> {
  try {
    // Get coordinates from city name
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`,
    )

    if (!geoResponse.ok) {
      throw new Error(`Geocoding API error: ${geoResponse.statusText}`)
    }

    const geoData = await geoResponse.json()

    if (!geoData.length) {
      throw new Error(`City not found: ${city}`)
    }

    const { lat, lon } = geoData[0]

    // Get weather using coordinates
    return getWeatherByCoordinates(lat, lon, units)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw error
  }
}

// Helper function to get weather icon URL
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}

// Helper function to format date from timestamp
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString("en-US", { weekday: "short" })
}
