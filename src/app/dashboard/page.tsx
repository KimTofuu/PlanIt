import Link from "next/link";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
            {/* Header */}
            <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            PlanIt
                        </Link>
                        <nav className="hidden md:flex gap-6">
                            <Link href="/dashboard" className="text-neutral-900 dark:text-neutral-100 font-medium">
                                Boards
                            </Link>
                            <Link href="/dashboard/templates" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
                                Templates
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700">
                            🔔
                        </button>
                        <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700">
                            👤
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                        Welcome back! 👋
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Here's what's happening with your projects today.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 border border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-1">Total Boards</p>
                                <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">8</p>
                            </div>
                            <div className="text-4xl">📋</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 border border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-1">Active Tasks</p>
                                <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">24</p>
                            </div>
                            <div className="text-4xl">✅</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 border border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-1">Completed Today</p>
                                <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">12</p>
                            </div>
                            <div className="text-4xl">🎯</div>
                        </div>
                    </div>
                </div>

                {/* Recent Boards Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            Your Boards
                        </h2>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                            + Create Board
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Board Card 1 */}
                        <Link href="/dashboard/board/1" className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white hover:shadow-lg transition-shadow cursor-pointer">
                            <h3 className="text-xl font-semibold mb-2">Marketing Campaign</h3>
                            <p className="text-blue-100 text-sm mb-4">12 tasks • 3 members</p>
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-white/30 border-2 border-white"></div>
                                    <div className="w-8 h-8 rounded-full bg-white/30 border-2 border-white"></div>
                                    <div className="w-8 h-8 rounded-full bg-white/30 border-2 border-white"></div>
                                </div>
                            </div>
                        </Link>

                        {/* Board Card 2 */}
                        <Link href="/dashboard/board/2" className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white hover:shadow-lg transition-shadow cursor-pointer">
                            <h3 className="text-xl font-semibold mb-2">Product Development</h3>
                            <p className="text-purple-100 text-sm mb-4">8 tasks • 5 members</p>
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-white/30 border-2 border-white"></div>
                                    <div className="w-8 h-8 rounded-full bg-white/30 border-2 border-white"></div>
                                    <div className="w-8 h-8 rounded-full bg-white/30 border-2 border-white"></div>
                                </div>
                            </div>
                        </Link>

                        {/* Board Card 3 */}
                        <Link href="/dashboard/board/3" className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white hover:shadow-lg transition-shadow cursor-pointer">
                            <h3 className="text-xl font-semibold mb-2">Design Sprint</h3>
                            <p className="text-green-100 text-sm mb-4">15 tasks • 4 members</p>
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-white/30 border-2 border-white"></div>
                                    <div className="w-8 h-8 rounded-full bg-white/30 border-2 border-white"></div>
                                    <div className="w-8 h-8 rounded-full bg-white/30 border-2 border-white"></div>
                                </div>
                            </div>
                        </Link>

                        {/* Board Card 4 */}
                        <Link href="/dashboard/board/4" className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white hover:shadow-lg transition-shadow cursor-pointer">
                            <h3 className="text-xl font-semibold mb-2">Customer Support</h3>
                            <p className="text-orange-100 text-sm mb-4">6 tasks • 2 members</p>
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-white/30 border-2 border-white"></div>
                                    <div className="w-8 h-8 rounded-full bg-white/30 border-2 border-white"></div>
                                </div>
                            </div>
                        </Link>

                        {/* Create New Board Card */}
                        <button className="bg-white dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-6 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors text-center flex flex-col items-center justify-center min-h-[180px]">
                            <div className="text-4xl mb-2">➕</div>
                            <p className="text-neutral-600 dark:text-neutral-400 font-medium">Create New Board</p>
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                        Recent Activity
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                            <div className="flex-1">
                                <p className="text-neutral-900 dark:text-neutral-100">
                                    <span className="font-semibold">John Doe</span> completed task "Design Homepage"
                                </p>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                            <div className="flex-1">
                                <p className="text-neutral-900 dark:text-neutral-100">
                                    <span className="font-semibold">Jane Smith</span> added a comment on "API Integration"
                                </p>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">4 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                            <div className="flex-1">
                                <p className="text-neutral-900 dark:text-neutral-100">
                                    <span className="font-semibold">Mike Johnson</span> created a new board "Q4 Planning"
                                </p>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">1 day ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}