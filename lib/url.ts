export function stringifyQueryParams(queryParams: Record<string, unknown>) {
	const params = new URLSearchParams();

	Object.entries(queryParams).forEach(([key, value]) => {
		if (value !== null && value !== undefined && value !== '') {
			params.set(key, String(value));
		}
	});

	return params.toString();
}

export function isUrl(value: string) {
	try {
		new URL(value);
		return true;
	} catch (_) {
		return false;
	}
}
