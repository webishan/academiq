'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { type ControllerRenderProps } from 'react-hook-form';

export function PasswordInput({ label = 'Password', field, disabled }: { label?: string; field: ControllerRenderProps<any>; disabled?: boolean }) {
	const [showPassword, setShowPassword] = useState(false);
	const togglePasswordVisibility = () => setShowPassword(!showPassword);

	return (
		<FormItem>
			<FormLabel>{label}</FormLabel>
			<FormControl>
				<div className="relative">
					<Input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" {...field} disabled={disabled} />
					<button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={togglePasswordVisibility} disabled={disabled}>
						{showPassword ? <EyeOff className="size-5 text-gray-500" /> : <Eye className="size-5 text-gray-500" />}
					</button>
				</div>
			</FormControl>
			<FormMessage className="truncate" />
		</FormItem>
	);
}
