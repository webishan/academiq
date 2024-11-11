import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LinkButtonProps extends ButtonProps {
	href: string;
	className?: string;
	children: React.ReactNode;
}

export default function LinkButton({ href, className, children, ...props }: LinkButtonProps) {
	return (
		<Button asChild className={cn('w-full sm:w-auto', className)} {...props}>
			<Link href={href}>{children}</Link>
		</Button>
	);
}
