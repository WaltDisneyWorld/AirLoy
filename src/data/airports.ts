import type { Airport } from "../types";

// A compact world airport set with coordinates, so award distances and earned
// miles are computed from real great-circle geography (see lib/distance.ts) —
// no hard-coded mileage tables.
export const AIRPORTS: Airport[] = [
  { code: "SFO", city: "San Francisco", country: "United States", name: "San Francisco Intl", lat: 37.6213, lng: -122.379 },
  { code: "LAX", city: "Los Angeles", country: "United States", name: "Los Angeles Intl", lat: 33.9416, lng: -118.4085 },
  { code: "SEA", city: "Seattle", country: "United States", name: "Seattle–Tacoma Intl", lat: 47.4502, lng: -122.3088 },
  { code: "DEN", city: "Denver", country: "United States", name: "Denver Intl", lat: 39.8561, lng: -104.6737 },
  { code: "ORD", city: "Chicago", country: "United States", name: "O'Hare Intl", lat: 41.9742, lng: -87.9073 },
  { code: "DFW", city: "Dallas", country: "United States", name: "Dallas/Fort Worth Intl", lat: 32.8998, lng: -97.0403 },
  { code: "JFK", city: "New York", country: "United States", name: "John F. Kennedy Intl", lat: 40.6413, lng: -73.7781 },
  { code: "EWR", city: "Newark", country: "United States", name: "Newark Liberty Intl", lat: 40.6895, lng: -74.1745 },
  { code: "BOS", city: "Boston", country: "United States", name: "Logan Intl", lat: 42.3656, lng: -71.0096 },
  { code: "MIA", city: "Miami", country: "United States", name: "Miami Intl", lat: 25.7959, lng: -80.287 },
  { code: "ATL", city: "Atlanta", country: "United States", name: "Hartsfield–Jackson", lat: 33.6407, lng: -84.4277 },
  { code: "IAD", city: "Washington", country: "United States", name: "Washington Dulles Intl", lat: 38.9531, lng: -77.4565 },
  { code: "YYZ", city: "Toronto", country: "Canada", name: "Toronto Pearson Intl", lat: 43.6777, lng: -79.6248 },
  { code: "MEX", city: "Mexico City", country: "Mexico", name: "Benito Juárez Intl", lat: 19.4363, lng: -99.0721 },
  { code: "GRU", city: "São Paulo", country: "Brazil", name: "Guarulhos Intl", lat: -23.4356, lng: -46.4731 },
  { code: "LHR", city: "London", country: "United Kingdom", name: "Heathrow", lat: 51.47, lng: -0.4543 },
  { code: "CDG", city: "Paris", country: "France", name: "Charles de Gaulle", lat: 49.0097, lng: 2.5479 },
  { code: "AMS", city: "Amsterdam", country: "Netherlands", name: "Schiphol", lat: 52.3105, lng: 4.7683 },
  { code: "FRA", city: "Frankfurt", country: "Germany", name: "Frankfurt am Main", lat: 50.0379, lng: 8.5622 },
  { code: "MAD", city: "Madrid", country: "Spain", name: "Adolfo Suárez Barajas", lat: 40.4719, lng: -3.5626 },
  { code: "FCO", city: "Rome", country: "Italy", name: "Leonardo da Vinci", lat: 41.8003, lng: 12.2389 },
  { code: "IST", city: "Istanbul", country: "Türkiye", name: "Istanbul Airport", lat: 41.2753, lng: 28.7519 },
  { code: "DXB", city: "Dubai", country: "United Arab Emirates", name: "Dubai Intl", lat: 25.2532, lng: 55.3657 },
  { code: "DOH", city: "Doha", country: "Qatar", name: "Hamad Intl", lat: 25.2731, lng: 51.6081 },
  { code: "TLV", city: "Tel Aviv", country: "Israel", name: "Ben Gurion Intl", lat: 32.0114, lng: 34.8867 },
  { code: "BOM", city: "Mumbai", country: "India", name: "Chhatrapati Shivaji", lat: 19.0896, lng: 72.8656 },
  { code: "DEL", city: "Delhi", country: "India", name: "Indira Gandhi Intl", lat: 28.5562, lng: 77.1 },
  { code: "SIN", city: "Singapore", country: "Singapore", name: "Changi", lat: 1.3644, lng: 103.9915 },
  { code: "HKG", city: "Hong Kong", country: "Hong Kong", name: "Hong Kong Intl", lat: 22.308, lng: 113.9185 },
  { code: "NRT", city: "Tokyo", country: "Japan", name: "Narita Intl", lat: 35.772, lng: 140.3929 },
  { code: "HND", city: "Tokyo", country: "Japan", name: "Haneda", lat: 35.5494, lng: 139.7798 },
  { code: "ICN", city: "Seoul", country: "South Korea", name: "Incheon Intl", lat: 37.4602, lng: 126.4407 },
  { code: "SYD", city: "Sydney", country: "Australia", name: "Kingsford Smith", lat: -33.9399, lng: 151.1753 },
  { code: "AKL", city: "Auckland", country: "New Zealand", name: "Auckland Intl", lat: -37.0082, lng: 174.785 },
  { code: "JNB", city: "Johannesburg", country: "South Africa", name: "O. R. Tambo Intl", lat: -26.1392, lng: 28.246 },
  { code: "GIG", city: "Rio de Janeiro", country: "Brazil", name: "Galeão Intl", lat: -22.81, lng: -43.2506 },
  { code: "EZE", city: "Buenos Aires", country: "Argentina", name: "Ministro Pistarini", lat: -34.8222, lng: -58.5358 },
];

export const AIRPORT_BY_CODE: Record<string, Airport> = Object.fromEntries(
  AIRPORTS.map((a) => [a.code, a])
);

export function airport(code: string): Airport | undefined {
  return AIRPORT_BY_CODE[code];
}

/** "San Francisco (SFO)" */
export function airportLabel(code: string): string {
  const a = AIRPORT_BY_CODE[code];
  return a ? `${a.city} (${a.code})` : code;
}
