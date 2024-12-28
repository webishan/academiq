import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AvatarProps {
	src?: string | null;
	name: string;
	className?: string;
}

export function Avatar({ src, name, className }: AvatarProps) {
	if (src) {
		return <Image src={src} alt={name} className={cn('rounded-full object-cover w-8 h-8', className)} height={32} width={32} />;
	}

	return (
		<div className={cn('rounded-full w-8 h-8 flex items-center justify-center bg-gray-bg text-secondary-foreground font-medium', className)}>
			{name.charAt(0).toUpperCase()}
		</div>
	);
}
