"use client";

import Link from "next/link";
import { useState } from "react";

export default function BoardPage() {
    const [lists, setLists] = useState([
        {
            id: 1,
            title: "To Do",
            cards: [
                { id: 1, title: "Design new landing page", description: "Create mockups for the new homepage", labels: ["Design", "High Priority"], dueDate: "Oct 25" },
                { id: 2, title: "Update documentation", description: "Add API endpoints documentation", labels: ["Documentation"], dueDate: "Oct 28" },
                { id: 3, title: "Fix navigation bug", description: "", labels: ["Bug"], dueDate: "Oct 24" },
            ],
        },
        {
            id: 2,
            title: "In Progress",
            cards: [
                { id: 4, title: "Implement authentication", description: "Add OAuth2 integration", labels: ["Development"], dueDate: "Oct 26" },
                { id: 5, title: "Database migration", description: "Migrate from MongoDB to PostgreSQL", labels: ["Backend", "High Priority"], dueDate: "Oct 27" },
            ],
        },
        {
            id: 3,
            title: "Review",
            cards: [
                { id: 6, title: "Code review for PR #123", description: "", labels: ["Review"], dueDate: "Oct 23" },
            ],
        },
        {
            id: 4,
            title: "Done",
            cards: [
                { id: 7, title: "Setup CI/CD pipeline", description: "Configure GitHub Actions", labels: ["DevOps"], dueDate: "Oct 20" },
                { id: 8, title: "Create project structure", description: "", labels: ["Setup"], dueDate: "Oct 18" },
            ],
        },
    ]);

    const [showAddList, setShowAddList] = useState(false);

    const getLabelColor = (label: string) => {
        const colors: { [key: string]: string } = {
            "Design": "bg-purple-500",
            "High Priority": "bg-red-500",
            "Documentation": "bg-blue-500",
            "Bug": "bg-orange-500",
            "Development": "bg-green-500",
            "Backend": "bg-yellow-500",
            "Review": "bg-pink-500",
            "DevOps": "bg-indigo-500",
            "Setup": "bg-gray-500",
        };
        return colors[label] || "bg-gray-500";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
            {/* Header */}
            <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-white hover:bg-white/10 p-2 rounded-lg">
                            ← Back
                        </Link>
                        <h1 className="text-2xl font-bold text-white">Marketing Campaign</h1>
                        <button className="text-white/80 hover:text-white">⭐</button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center text-white text-sm font-semibold">
                                JD
                            </div>
                            <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-white flex items-center justify-center text-white text-sm font-semibold">
                                JS
                            </div>
                            <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white flex items-center justify-center text-white text-sm font-semibold">
                                MJ
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium backdrop-blur-sm">
                            + Invite
                        </button>
                        <button className="p-2 text-white hover:bg-white/10 rounded-lg">
                            ⋯
                        </button>
                    </div>
                </div>
            </header>

            {/* Board */}
            <main className="p-6 overflow-x-auto">
                <div className="flex gap-4 min-w-max">
                    {lists.map((list) => (
                        <div key={list.id} className="flex-shrink-0 w-80">
                            <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-3">
                                {/* List Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
                                        {list.title}
                                        <span className="ml-2 text-sm text-neutral-500">
                                            {list.cards.length}
                                        </span>
                                    </h2>
                                    <button className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
                                        ⋯
                                    </button>
                                </div>

                                {/* Cards */}
                                <div className="space-y-2 mb-2">
                                    {list.cards.map((card) => (
                                        <div
                                            key={card.id}
                                            className="bg-white dark:bg-neutral-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                        >
                                            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                                                {card.title}
                                            </h3>
                                            {card.description && (
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                                                    {card.description}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                                {card.labels.map((label, index) => (
                                                    <span
                                                        key={index}
                                                        className={`${getLabelColor(label)} text-white text-xs px-2 py-1 rounded-full`}
                                                    >
                                                        {label}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
                                                <div className="flex items-center gap-1">
                                                    📅 {card.dueDate}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>💬 0</span>
                                                    <span>📎 0</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add Card Button */}
                                <button className="w-full text-left px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                                    + Add a card
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add List */}
                    {!showAddList ? (
                        <button
                            onClick={() => setShowAddList(true)}
                            className="flex-shrink-0 w-80 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-white font-medium transition-colors"
                        >
                            + Add another list
                        </button>
                    ) : (
                        <div className="flex-shrink-0 w-80 bg-gray-100 dark:bg-neutral-800 rounded-lg p-3">
                            <input
                                type="text"
                                placeholder="Enter list title..."
                                className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 mb-2"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    Add List
                                </button>
                                <button
                                    onClick={() => setShowAddList(false)}
                                    className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}