// utils.ts — pure helpers, no React, no hooks

// Finds a specific address component by its Google type string
// e.g. getComponent(c, "locality") → "Bharatpur"
export function getComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string,
): string {
  return components.find((c) => c.types.includes(type))?.long_name ?? "";
}

// Parses Google's address_components array into our flat LocationState fields
// Nepal hierarchy:
//   locality / administrative_area_level_3 → city
//   administrative_area_level_2            → district
//   administrative_area_level_1            → province
//   sublocality_level_1 + route + premise  → street address
export function parseAddressComponents(
  components: google.maps.GeocoderAddressComponent[],
): { address: string; city: string; district: string; province: string } {
  const locality = getComponent(components, "locality");
  const level3 = getComponent(components, "administrative_area_level_3");
  const level2 = getComponent(components, "administrative_area_level_2");
  const level1 = getComponent(components, "administrative_area_level_1");
  const sublocal = getComponent(components, "sublocality_level_1");
  const route = getComponent(components, "route");
  const premise = getComponent(components, "premise");

  const address =
    [premise, sublocal, route].filter(Boolean).join(", ") || locality;

  return {
    address,
    city: locality || level3,
    district: level2,
    province: level1,
  };
}
