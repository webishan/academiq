import { RootNavbar } from '@/components/navbars/RootNavbar';
import { Toaster } from '@/components/ui/toaster';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="flex flex-col min-h-screen">
			<RootNavbar />
			{children}
			<Toaster />
		</main>
	);
};

export default RootLayout;
