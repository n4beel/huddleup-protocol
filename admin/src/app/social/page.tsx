export default function Social() {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Social</h1>
                <p className="text-gray-600">Connect with the HuddleUp community</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <textarea
                                    placeholder="What's happening in the Web3 world?"
                                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-4">
                                <button className="text-gray-500 hover:text-blue-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </button>
                                <button className="text-gray-500 hover:text-green-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Post
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h4 className="font-semibold text-gray-900">Alice Johnson</h4>
                                        <span className="text-gray-500">@alice.eth</span>
                                        <span className="text-gray-400">·</span>
                                        <span className="text-gray-500 text-sm">2h</span>
                                    </div>
                                    <p className="text-gray-700 mb-3">
                                        Just deployed my first smart contract on Ethereum! 🚀 The Web3 journey continues.
                                        Excited to see what the future holds for decentralized applications.
                                    </p>
                                    <div className="flex items-center space-x-6 text-gray-500">
                                        <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <span className="text-sm">12</span>
                                        </button>
                                        <button className="flex items-center space-x-1 hover:text-green-600 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            <span className="text-sm">5</span>
                                        </button>
                                        <button className="hover:text-purple-600 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h4 className="font-semibold text-gray-900">Bob Smith</h4>
                                        <span className="text-gray-500">@bobsmith.eth</span>
                                        <span className="text-gray-400">·</span>
                                        <span className="text-gray-500 text-sm">4h</span>
                                    </div>
                                    <p className="text-gray-700 mb-3">
                                        The future of social networking is decentralized! HuddleUp is building something amazing.
                                        Can&apos;t wait to see how this protocol evolves. #Web3 #DeFi #Social
                                    </p>
                                    <div className="flex items-center space-x-6 text-gray-500">
                                        <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <span className="text-sm">8</span>
                                        </button>
                                        <button className="flex items-center space-x-1 hover:text-green-600 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            <span className="text-sm">3</span>
                                        </button>
                                        <button className="hover:text-purple-600 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Topics</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-blue-600 font-medium">#Web3</span>
                                <span className="text-gray-500 text-sm">1.2k posts</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-blue-600 font-medium">#DeFi</span>
                                <span className="text-gray-500 text-sm">856 posts</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-blue-600 font-medium">#NFT</span>
                                <span className="text-gray-500 text-sm">642 posts</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-blue-600 font-medium">#Blockchain</span>
                                <span className="text-gray-500 text-sm">534 posts</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-blue-600 font-medium">#Ethereum</span>
                                <span className="text-gray-500 text-sm">423 posts</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Connections</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">Charlie Brown</p>
                                    <p className="text-sm text-gray-500">@charlie.eth</p>
                                </div>
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                    Connect
                                </button>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">Diana Prince</p>
                                    <p className="text-sm text-gray-500">@diana.eth</p>
                                </div>
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                    Connect
                                </button>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">Eve Wilson</p>
                                    <p className="text-sm text-gray-500">@eve.eth</p>
                                </div>
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                    Connect
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
