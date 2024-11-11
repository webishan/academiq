import { RootNavbar } from '@/components/navbars/RootNavbar';
const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="flex flex-col min-h-screen">
			<RootNavbar />
			{children}
			{/* <Toaster /> */}
		</main>
	);
};

export default RootLayout;
