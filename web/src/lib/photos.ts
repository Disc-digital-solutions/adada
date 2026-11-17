/**
 * Photographs used by the site's own pages (not listing photos), with their credits.
 * Each is a real photo under an open licence; the licence asks for the credit shown on the page.
 * `place` is set only when the photo really shows that place.
 */
export interface SitePhoto {
  src: string;
  width: number;
  height: number;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
  /** The area (a CITIES slug) the photo shows, when it is on the island. */
  place?: string;
  /** True for a generic photo standing in for real listing photos. */
  example?: boolean;
}

/** The harbour of Girne (Kyrenia), North Cyprus. */
export const HARBOUR_PHOTO: SitePhoto = {
  src: "/photos/girne-harbour.jpg",
  width: 900,
  height: 600,
  author: "Michal Klajban",
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  source: "https://commons.wikimedia.org/wiki/File:Harbour,_Kyrenia,_Northern_Cyprus_06.jpg",
  place: "kyrenia",
};

/** A generic flat interior, not on the island: it illustrates a housing ad until real listings have photos. */
export const EXAMPLE_ROOM_PHOTO: SitePhoto = {
  src: "/photos/example-living-room.jpg",
  width: 1100,
  height: 734,
  author: "Shixart1985",
  license: "CC BY 2.0",
  licenseUrl: "https://creativecommons.org/licenses/by/2.0",
  source: "https://commons.wikimedia.org/wiki/File:Modern_living_room_with_stylish_furniture_and_a_view_of_the_outdoors_in_a_cozy_apartment_setting.jpg",
  example: true,
};

export const SITE_PHOTOS = [HARBOUR_PHOTO, EXAMPLE_ROOM_PHOTO];
