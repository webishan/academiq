export function stringifyQueryParams(queryParams: Record<string, unknown>) {
	return Object.entries(queryParams)
		.filter(([_, value]) => value !== null && value !== undefined)
		.map(([key, value]) => (value instanceof Date ? `${key}=${value.getTime()}` : `${key}=${encodeURIComponent(value as string)}`))
		.join('&');
}

export function isUrl(value: string) {
	try {
		new URL(value);
		return true;
	} catch (_) {
		return false;
	}
}
