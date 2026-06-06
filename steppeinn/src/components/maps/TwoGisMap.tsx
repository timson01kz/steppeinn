"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CatalogHotel, LocationCardData } from "@/types";

type MapglApi = {
  Map: new (
    container: HTMLElement,
    options: {
      center: [number, number];
      key: string;
      pitch?: number;
      rotation?: number;
      zoom: number;
      zoomControl?: boolean | string;
    },
  ) => MapglMap;
  Marker: new (
    map: MapglMap,
    options: {
      coordinates: [number, number];
      icon?: string;
      label?: { text: string };
      size?: [number, number];
    },
  ) => MapglMarker;
  Clusterer?: new (
    map: MapglMap,
    options: {
      radius?: number;
    },
  ) => MapglClusterer;
};

type MapglMap = {
  destroy: () => void;
  setCenter?: (coordinates: [number, number]) => void;
  setZoom?: (zoom: number) => void;
};

type MapglMarker = {
  destroy: () => void;
  on?: (event: "click", callback: () => void) => void;
};

type MapglClusterer = {
  destroy: () => void;
  load: (
    markers: Array<{
      coordinates: [number, number];
      icon?: string;
      label?: { text: string };
      size?: [number, number];
      userData?: { slug: string };
    }>,
  ) => void;
  on?: (event: "click", callback: (event: ClusterClickEvent) => void) => void;
};

type ClusterClickEvent = {
  target?: {
    data?: {
      userData?: { slug?: string };
    };
  };
};

declare global {
  interface Window {
    mapgl?: MapglApi;
  }
}

type TwoGisMapProps = {
  activeSlug?: string;
  className?: string;
  locations?: LocationCardData[];
  onPropertySelect?: (slug: string) => void;
  properties: CatalogHotel[];
  showCard?: boolean;
};

const ALMATY_CENTER: [number, number] = [76.945, 43.238];
const MAPGL_SCRIPT_ID = "steppeinn-2gis-mapgl";
const CLUSTERER_SCRIPT_ID = "steppeinn-2gis-clusterer";
const PROPERTY_MARKER_ICON =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42"><circle cx="21" cy="21" r="13" fill="#2f4d46" stroke="white" stroke-width="4"/><circle cx="21" cy="21" r="5" fill="#f0bb67"/></svg>`,
  );
const LOCATION_MARKER_ICON =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="10" fill="#f0bb67" stroke="white" stroke-width="3"/><circle cx="17" cy="17" r="3" fill="#17130f"/></svg>`,
  );

let mapglPromise: Promise<MapglApi> | null = null;

function loadScript(id: string, src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Unable to load ${src}`)), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true },
    );
    script.addEventListener("error", () => reject(new Error(`Unable to load ${src}`)), {
      once: true,
    });
    document.head.appendChild(script);
  });
}

function loadMapgl() {
  if (!mapglPromise) {
    mapglPromise = Promise.all([
      loadScript(MAPGL_SCRIPT_ID, "https://mapgl.2gis.com/api/js/v1"),
      loadScript(
        CLUSTERER_SCRIPT_ID,
        "https://unpkg.com/@2gis/mapgl-clusterer@^2/dist/clustering.js",
      ),
    ]).then(() => {
      if (!window.mapgl) {
        throw new Error("2GIS MapGL did not expose window.mapgl.");
      }

      return window.mapgl;
    });
  }

  return mapglPromise;
}

function getCoordinates(hotel: CatalogHotel, index: number): [number, number] {
  if (typeof hotel.longitude === "number" && typeof hotel.latitude === "number") {
    return [hotel.longitude, hotel.latitude];
  }

  const offset = index * 0.008;
  return [ALMATY_CENTER[0] + offset - 0.025, ALMATY_CENTER[1] + offset * 0.45];
}

function getLocationCoordinates(location: LocationCardData, index: number): [number, number] | null {
  if (typeof location.longitude === "number" && typeof location.latitude === "number") {
    return [location.longitude, location.latitude];
  }

  const x = Number.parseFloat(location.x);
  const y = Number.parseFloat(location.y);
  if (Number.isNaN(x) || Number.isNaN(y)) return null;

  return [
    76.78 + (x / 100) * 0.32 + index * 0.0007,
    43.36 - (y / 100) * 0.24 - index * 0.0004,
  ];
}

export function TwoGisMap({
  activeSlug,
  className = "",
  locations = [],
  onPropertySelect,
  properties,
  showCard = true,
}: TwoGisMapProps) {
  const mapKey = process.env.NEXT_PUBLIC_2GIS_MAP_KEY;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapglMap | null>(null);
  const markersRef = useRef<MapglMarker[]>([]);
  const clustererRef = useRef<MapglClusterer | null>(null);
  const [selectedSlug, setSelectedSlug] = useState(activeSlug ?? properties[0]?.slug ?? "");
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(mapKey));
  const currentSelectedSlug = activeSlug ?? selectedSlug;

  const selectedProperty = useMemo(
    () => properties.find((property) => property.slug === currentSelectedSlug) ?? properties[0],
    [currentSelectedSlug, properties],
  );

  useEffect(() => {
    if (!mapKey || !containerRef.current) {
      setIsLoading(false);
      return;
    }

    let active = true;
    const apiKey = mapKey;

    async function initMap() {
      try {
        setIsLoading(true);
        const mapgl = await loadMapgl();
        if (!active || !containerRef.current) return;

        const map = new mapgl.Map(containerRef.current, {
          center: ALMATY_CENTER,
          key: apiKey,
          pitch: 0,
          zoom: 11,
          zoomControl: true,
        });

        mapRef.current = map;

        const propertyMarkers: MapglMarker[] = [];

        const locationMarkers = locations
          .map((location, index) => {
            const coordinates = getLocationCoordinates(location, index);
            if (!coordinates) return null;

            return new mapgl.Marker(map, {
              coordinates,
              icon: LOCATION_MARKER_ICON,
              label: { text: location.name },
              size: [34, 34],
            });
          })
          .filter(Boolean) as MapglMarker[];

        if (mapgl.Clusterer && properties.length > 1) {
          const clusterer = new mapgl.Clusterer(map, { radius: 72 });
          clusterer.load(
            properties.map((property, index) => ({
              coordinates: getCoordinates(property, index),
              icon: PROPERTY_MARKER_ICON,
              size: [42, 42],
              userData: { slug: property.slug },
            })),
          );
          clusterer.on?.("click", (event) => {
            const slug = event.target?.data?.userData?.slug;
            if (!slug) return;

            setSelectedSlug(slug);
            onPropertySelect?.(slug);
          });
          clustererRef.current = clusterer;
        } else {
          propertyMarkers.push(
            ...properties.map((property, index) => {
              const coordinates = getCoordinates(property, index);
              const marker = new mapgl.Marker(map, {
                coordinates,
                icon: PROPERTY_MARKER_ICON,
                size: [42, 42],
              });
              marker.on?.("click", () => {
                setSelectedSlug(property.slug);
                onPropertySelect?.(property.slug);
              });
              return marker;
            }),
          );
        }

        markersRef.current = [...propertyMarkers, ...locationMarkers];

        setMapError(null);
      } catch (error) {
        if (!active) return;
        setMapError(error instanceof Error ? error.message : "Unable to load 2GIS map.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    initMap();

    return () => {
      active = false;
      clustererRef.current?.destroy();
      clustererRef.current = null;
      markersRef.current.forEach((marker) => marker.destroy());
      markersRef.current = [];
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, [locations, mapKey, onPropertySelect, properties]);

  useEffect(() => {
    if (!selectedProperty || !mapRef.current) return;
    const index = properties.findIndex((property) => property.slug === selectedProperty.slug);
    const coordinates = getCoordinates(selectedProperty, Math.max(0, index));
    mapRef.current.setCenter?.(coordinates);
    mapRef.current.setZoom?.(13);
  }, [properties, selectedProperty]);

  function selectProperty(slug: string) {
    setSelectedSlug(slug);
    onPropertySelect?.(slug);
  }

  return (
    <div className={`relative overflow-hidden rounded-lg border border-stone-200 bg-[#dde8df] ${className}`}>
      <div className="h-full min-h-[420px] w-full" ref={containerRef} />

      {!mapKey ? (
        <div className="absolute inset-0 grid place-items-center bg-[#dde8df] p-5 text-center">
          <div className="max-w-md rounded-lg bg-white/92 p-5 shadow-lg">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#a66f2d]">
              2GIS map
            </p>
            <h3 className="mt-2 text-2xl font-semibold">Map key required</h3>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Add NEXT_PUBLIC_2GIS_MAP_KEY to enable the live 2GIS map.
            </p>
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <div className="absolute inset-0 grid place-items-center bg-white/70 text-sm font-bold text-[#2f4d46]">
          Loading 2GIS map...
        </div>
      ) : null}

      {mapError ? (
        <div className="absolute left-4 right-4 top-4 rounded-lg border border-[#efc4bd] bg-[#fff0ed] px-4 py-3 text-sm font-semibold text-[#9b2d25]">
          {mapError}
        </div>
      ) : null}

      {showCard && selectedProperty ? (
        <div className="absolute bottom-4 left-4 right-4 z-10 max-w-sm rounded-lg bg-white p-4 shadow-[0_18px_60px_rgba(34,28,18,.18)] sm:right-auto">
          <div className="flex gap-4">
            <div
              className={`h-24 w-28 shrink-0 overflow-hidden rounded-md ${selectedProperty.imageUrl ? "bg-stone-200" : selectedProperty.imageClass}`}
            >
              {selectedProperty.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={selectedProperty.name}
                  className="h-full w-full object-cover"
                  src={selectedProperty.imageUrl}
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">{selectedProperty.name}</p>
              <p className="mt-1 text-sm font-semibold text-stone-500">
                from {selectedProperty.price}
              </p>
              <Link
                className="mt-3 inline-flex rounded-md bg-[#2f4d46] px-4 py-2 text-sm font-bold text-white"
                href={`/hotels/${selectedProperty.slug}`}
              >
                View property
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {properties.length > 0 ? (
        <div className="absolute right-4 top-4 z-10 hidden max-h-[calc(100%-2rem)] w-56 overflow-auto rounded-lg bg-white/92 p-2 shadow-lg lg:block">
          {properties.map((property) => (
            <button
              className={`block w-full rounded-md px-3 py-2 text-left text-sm font-semibold transition ${
                currentSelectedSlug === property.slug
                  ? "bg-[#2f4d46] text-white"
                  : "hover:bg-stone-100"
              }`}
              key={property.slug}
              onClick={() => selectProperty(property.slug)}
              type="button"
            >
              {property.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
