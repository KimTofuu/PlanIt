import Link from "next/link";

export default function Home() {
    return (
        <div className="font-sans min-h-screen bg-gray-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
            <header className="max-w-6xl mx-auto p-6 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold">
                    PlanIt
                </Link>
                <nav className="hidden sm:flex gap-6 items-center">
                    <Link href="#features" className="hover:underline">
                        Features
                    </Link>
                    <Link href="#pricing" className="hover:underline">
                        Pricing
                    </Link>
                    <Link href="#about" className="hover:underline">
                        About
                    </Link>
                    <Link href="/pages/sign-in" className="px-4 py-2 bg-foreground text-background rounded-full hover:bg-gray-600 hover:text-white">
                        Sign in
                    </Link>
                    <Link href="/pages/sign-up" className="px-4 py-2 bg-foreground text-background rounded-full hover:bg-gray-600 hover:text-white">
                        Sign up
                    </Link>
                </nav>
            </header>

            <main className="max-w-6xl mx-auto px-6">
                {/* Hero Section */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center py-12">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
                            Organize your work and life with PlanIt
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                            Manage projects, track tasks, and collaborate with your team seamlessly. 
                            Visualize your workflow with boards, lists, and cards — just like Trello.
                        </p>
                        <div className="flex gap-4 flex-wrap">
                            <Link href="/pages/sign-up" className="px-6 py-3 bg-foreground text-background rounded-md font-medium hover:opacity-90">
                                Get Started Free
                            </Link>
                            <Link href="#features" className="px-6 py-3 border rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                View Features
                            </Link>
                        </div>
                    </div>
                    <div className="bg-neutral-200 dark:bg-neutral-800 rounded-lg p-8 h-80 flex items-center justify-center">
                        <p className="text-neutral-500 dark:text-neutral-400">
                            [Task Board Preview Placeholder]
                        </p>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-16">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Features that boost your productivity
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm">
                            <div className="text-4xl mb-4">📋</div>
                            <h3 className="text-xl font-semibold mb-2">Boards & Lists</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Create boards for projects and organize tasks into customizable lists.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm">
                            <div className="text-4xl mb-4">🏷️</div>
                            <h3 className="text-xl font-semibold mb-2">Labels & Tags</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Categorize and prioritize tasks with color-coded labels.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm">
                            <div className="text-4xl mb-4">👥</div>
                            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Invite team members, assign tasks, and work together in real-time.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm">
                            <div className="text-4xl mb-4">📅</div>
                            <h3 className="text-xl font-semibold mb-2">Due Dates</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Set deadlines and receive reminders to stay on track.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm">
                            <div className="text-4xl mb-4">📎</div>
                            <h3 className="text-xl font-semibold mb-2">Attachments</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Add files, images, and links directly to your cards.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Monitor project progress with visual analytics and reports.
                            </p>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-16 bg-white dark:bg-neutral-800 -mx-6 px-6 rounded-lg">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">About PlanIt</h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-4">
                            PlanIt is a powerful task management platform designed to help individuals and teams 
                            organize their work efficiently. Whether you&apos;re managing personal projects or coordinating 
                            with a large team, PlanIt provides the tools you need to stay productive.
                        </p>
                        <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-4">
                            Inspired by the simplicity and effectiveness of Trello, we&apos;ve built PlanIt to be intuitive, 
                            flexible, and powerful. Our mission is to make project management accessible to everyone, 
                            from students to professionals.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
                            <div>
                                <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10K+</h3>
                                <p className="text-neutral-600 dark:text-neutral-400">Active Users</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">50K+</h3>
                                <p className="text-neutral-600 dark:text-neutral-400">Projects Created</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">99.9%</h3>
                                <p className="text-neutral-600 dark:text-neutral-400">Uptime</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="max-w-6xl mx-auto px-6 py-8 mt-16 border-t border-neutral-200 dark:border-neutral-800">
                <div className="text-center text-neutral-600 dark:text-neutral-400">
                    <p>&copy; 2025 PlanIt. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
