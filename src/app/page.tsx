import Link from "next/link";

export default function Home() {
	return (
		<div className="font-sans min-h-screen bg-gray-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
			<header className="max-w-6xl mx-auto p-6 flex items-center justify-between">
				<Link href="/" className="text-2xl font-bold">
					Shoply
				</Link>
				<nav className="hidden sm:flex gap-6 items-center">
					<Link href="#" className="hover:underline">
						Men
					</Link>
					<Link href="#" className="hover:underline">
						Women
					</Link>
					<Link href="#" className="hover:underline">
						Accessories
					</Link>
					<Link href="/sign-in" className="px-4 py-2 bg-foreground text-background rounded-full hover:bg-gray-600 hover:text-white">
						Sign in
					</Link>
          <Link href="/sign-up" className="px-4 py-2 bg-foreground text-background rounded-full hover:bg-gray-600 hover:text-white">
						Sign up
					</Link>
				</nav>
			</header>

			<main className="max-w-6xl mx-auto px-6">
				<section className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center py-12">
					<div>
						<h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
							Modern essentials for everyday life
						</h1>
						<p className="text-neutral-600 dark:text-neutral-300 mb-6">
							Curated pieces — built to last. Free returns. Fast shipping.
							Discover new arrivals and best sellers.
						</p>
						<div className="flex gap-4 flex-wrap">
							<Link href="#" className="px-6 py-3 bg-foreground text-background rounded-md font-medium">
								Shop Now
							</Link>
							<Link href="#" className="px-6 py-3 border rounded-md">
								Explore Collections
							</Link>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
