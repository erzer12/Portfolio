'use client';

import type * as LeafletType from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/theme/ThemeContext';

// Kerala, India coordinates
const KERALA_COORDS: [number, number] = [10.15, 76.5];
const DEFAULT_ZOOM = 7.8;

const CARTO_KEY = process.env.NEXT_PUBLIC_CARTO_KEY || 'cb1_31yr_1_c550289dfdcca99ae44a32c2';

const DARK_TILES = `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png?key=${CARTO_KEY}`;
const LIGHT_TILES = `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png?key=${CARTO_KEY}`;

export function LocationMapWidget() {
	const { palette } = useTheme();
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<LeafletType.Map | null>(null);
	const tileLayerRef = useRef<LeafletType.TileLayer | null>(null);
	const paletteRef = useRef(palette);
	paletteRef.current = palette;

	// Live digital clock for Kerala, India (Asia/Kolkata - IST)
	const [istTime, setIstTime] = useState<string>('00:00:00');
	const [isNightTime, setIsNightTime] = useState<boolean>(false);

	useEffect(() => {
		const updateTime = () => {
			const now = new Date();
			// Get hours in IST for day/night icon calculation
			const hoursStr = now.toLocaleTimeString('en-US', {
				timeZone: 'Asia/Kolkata',
				hour12: false,
				hour: '2-digit',
			});
			const currentHour = Number.parseInt(hoursStr, 10);
			setIsNightTime(currentHour >= 18 || currentHour < 6);

			// Format HH:mm:ss in IST
			const timeString = now.toLocaleTimeString('en-GB', {
				timeZone: 'Asia/Kolkata',
				hour12: false,
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			});
			setIstTime(timeString);
		};

		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	}, []);

	// Initialize Leaflet map once on mount
	useEffect(() => {
		if (!mapContainerRef.current) return;

		let isSubscribed = true;
		let leafletMap: LeafletType.Map | null = null;
		let resizeObserver: ResizeObserver | null = null;

		// Dynamically import leaflet to prevent SSR window reference
		import('leaflet').then((L) => {
			if (!isSubscribed || !mapContainerRef.current) return;

			// If a map instance already exists, cleanup before re-init
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove();
				mapInstanceRef.current = null;
			}

			const container = mapContainerRef.current;
			// Clean up any remaining leaflet id on container
			// biome-ignore lint/suspicious/noExplicitAny: leaflet internal id property
			delete (container as any)._leaflet_id;

			leafletMap = L.map(container, {
				zoomControl: false,
				attributionControl: false,
				scrollWheelZoom: false, // Prevent catching page scroll
				doubleClickZoom: true,
				dragging: true,
				touchZoom: true,
				boxZoom: false,
				keyboard: false,
				zoomSnap: 0.5,
				zoomDelta: 0.5,
			}).setView(KERALA_COORDS, DEFAULT_ZOOM);

			mapInstanceRef.current = leafletMap;

			// CartoDB tiles: dark_all for Mocha/Frappe/Macchiato, light_all for Latte
			const initialTileUrl = paletteRef.current === 'latte' ? LIGHT_TILES : DARK_TILES;
			const tiles = L.tileLayer(initialTileUrl, {
				subdomains: 'abcd',
				maxZoom: 19,
				minZoom: 3,
			}).addTo(leafletMap);

			tileLayerRef.current = tiles;

			// Pulsing accent pin at Kerala
			const pinIcon = L.divIcon({
				className: 'leaflet-pulsing-marker',
				html: `
					<div style="position: relative; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; pointer-events: none;">
						<span style="position: absolute; width: 22px; height: 22px; border-radius: 9999px; background-color: var(--current-accent-color, #fab387); opacity: 0.5; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
						<span style="position: relative; width: 10px; height: 10px; border-radius: 9999px; background-color: var(--current-accent-color, #fab387); border: 2px solid #ffffff; box-shadow: 0 1px 6px rgba(0,0,0,0.45);"></span>
					</div>
				`,
				iconSize: [24, 24],
				iconAnchor: [12, 12],
			});

			L.marker(KERALA_COORDS, { icon: pinIcon, interactive: false }).addTo(leafletMap);

			// Auto-resize handler using ResizeObserver
			resizeObserver = new ResizeObserver(() => {
				if (leafletMap) {
					leafletMap.invalidateSize();
				}
			});
			resizeObserver.observe(container);

			// Initial invalidate size after brief render settling
			setTimeout(() => {
				if (isSubscribed && leafletMap) {
					leafletMap.invalidateSize();
				}
			}, 100);
		});

		return () => {
			isSubscribed = false;
			if (resizeObserver) {
				resizeObserver.disconnect();
			}
			if (leafletMap) {
				leafletMap.remove();
				mapInstanceRef.current = null;
			}
		};
	}, []);

	// Switch tile layer source dynamically on theme changes without re-initializing Leaflet
	useEffect(() => {
		if (tileLayerRef.current) {
			const targetUrl = palette === 'latte' ? LIGHT_TILES : DARK_TILES;
			tileLayerRef.current.setUrl(targetUrl);
		}
	}, [palette]);

	const handleRecenter = () => {
		if (mapInstanceRef.current) {
			mapInstanceRef.current.flyTo(KERALA_COORDS, DEFAULT_ZOOM, {
				duration: 0.8,
			});
		}
	};

	return (
		<div className="border border-surface0/80 bg-mantle flex flex-col rounded-xl p-4 shadow-lg lg:col-span-1 select-none">
			{/* Top Header: Currently Based In 📍 */}
			<button
				type="button"
				onClick={handleRecenter}
				className="text-text hover:text-accent mb-3 flex w-full cursor-pointer items-center gap-2 text-left text-sm font-semibold transition-colors"
				title="Recenter map to Kerala"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="tabler-icon tabler-icon-map-pin text-accent shrink-0"
					aria-hidden="true"
				>
					<path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
					<path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0" />
				</svg>
				<span>Currently Based In 📍</span>
			</button>

			{/* Center Map Container with CartoDB Tiles */}
			<div className="bg-surface0 relative w-full flex-1 min-h-[140px] overflow-hidden rounded-lg">
				<section
					ref={mapContainerRef}
					className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing"
					aria-label="Interactive Leaflet map showing Kerala, India"
				/>
			</div>

			{/* Bottom Bar: Location Recenter Button & Live IST Clock */}
			<div className="mt-3 flex items-center justify-between gap-2">
				<button
					type="button"
					onClick={handleRecenter}
					className="text-subtext0 hover:text-accent cursor-pointer text-xs whitespace-nowrap transition-colors font-mono"
					title="Recenter map to Kerala, India"
				>
					Kerala, India
				</button>
				<div className="flex items-center gap-1">
					{isNightTime ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="tabler-icon tabler-icon-moon text-blue shrink-0"
							aria-hidden="true"
						>
							<path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008" />
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="tabler-icon tabler-icon-sun text-yellow shrink-0"
							aria-hidden="true"
						>
							<circle cx="12" cy="12" r="4" />
							<path d="M12 2v2" />
							<path d="M12 20v2" />
							<path d="m4.93 4.93 1.41 1.41" />
							<path d="m17.66 17.66 1.41 1.41" />
							<path d="M2 12h2" />
							<path d="M20 12h2" />
							<path d="m6.34 17.66-1.41 1.41" />
							<path d="m19.07 4.93-1.41 1.41" />
						</svg>
					)}
					<span className="text-accent font-mono text-xs whitespace-nowrap">{istTime}</span>
				</div>
			</div>
		</div>
	);
}
