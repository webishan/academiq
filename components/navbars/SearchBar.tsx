'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const SearchBar = () => {
	const [isFocused, setIsFocused] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

	const handleSearch = (value: string) => {
		setSearchQuery(value);
		const params = new URLSearchParams(searchParams.toString());

		if (value) {
			params.set('q', value);
		} else {
			params.delete('q');
		}

		router.push(`/?${params.toString()}`);
	};

	return (
		<div className="relative max-w-md w-full">
			<div
				className={`relative flex items-center transition-all duration-300 ease-in-out ${
					isFocused ? 'bg-border shadow-lg' : 'bg-gray-bg'
				} rounded-full`}
			>
				<Search className={`absolute left-3 w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-purple-500' : 'text-gray-400'}`} />
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => handleSearch(e.target.value)}
					placeholder="Search by course code, user, title, or description"
					className="w-full py-2 pl-10 pr-4 text-foreground bg-transparent rounded-full focus:outline-none text-sm"
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
				/>
			</div>
		</div>
	);
};

export default SearchBar;
