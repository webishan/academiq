'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '../ui/button';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '../ui/date-range-picker';
const FilterBar = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [date, setDate] = useState<DateRange | undefined>({
		from: searchParams.get('fromDate') ? new Date(searchParams.get('fromDate')!) : undefined,
		to: searchParams.get('toDate') ? new Date(searchParams.get('toDate')!) : undefined,
	});

	const [filters, setFilters] = useState({
		hasLink: searchParams.get('hasLink') === 'true',
		hasMaterial: searchParams.get('hasMaterial') === 'true',
	});

	const handleFilterChange = (key: 'hasLink' | 'hasMaterial', checked: boolean) => {
		const newFilters = { ...filters, [key]: checked };
		setFilters(newFilters);
		updateSearchParams(newFilters, date);
	};

	const handleDateChange = (range: DateRange | undefined) => {
		setDate(range);
		updateSearchParams(filters, range);
	};

	const updateSearchParams = (currentFilters: typeof filters, dateRange: DateRange | undefined) => {
		const params = new URLSearchParams(searchParams.toString());

		Object.entries(currentFilters).forEach(([key, value]) => {
			if (value) {
				params.set(key, 'true');
			} else {
				params.delete(key);
			}
		});

		if (dateRange?.from) {
			params.set('fromDate', dateRange.from.toISOString());
		} else {
			params.delete('fromDate');
		}

		if (dateRange?.to) {
			params.set('toDate', dateRange.to.toISOString());
		} else {
			params.delete('toDate');
		}

		router.push(`/?${params.toString()}`);
	};

	const clearFilters = () => {
		setFilters({ hasLink: false, hasMaterial: false });
		setDate(undefined);
		router.push('/');
	};

	return (
		<aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-background border-r border-border p-4 flex flex-col gap-4 overflow-y-auto">
			<div className="pb-4 border-b">
				<h2 className="font-semibold text-lg">Filters</h2>
			</div>

			<div className="space-y-4">
				<div className="flex items-center space-x-2">
					<Checkbox id="hasLink" checked={filters.hasLink} onCheckedChange={(checked) => handleFilterChange('hasLink', checked as boolean)} />
					<label htmlFor="hasLink" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Has Link
					</label>
				</div>

				<div className="flex items-center space-x-2">
					<Checkbox
						id="hasMaterial"
						checked={filters.hasMaterial}
						onCheckedChange={(checked) => handleFilterChange('hasMaterial', checked as boolean)}
					/>
					<label htmlFor="hasMaterial" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Has Material
					</label>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium">Date Range</label>
					<DatePickerWithRange date={date} setDate={handleDateChange} />
				</div>

				<Button variant="outline" className="w-full" onClick={clearFilters}>
					Clear Filters
				</Button>
			</div>
		</aside>
	);
};

export default FilterBar;
