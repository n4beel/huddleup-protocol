export default function Profile() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
                <p className="text-gray-600">Manage your HuddleUp profile and settings</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">John Doe</h3>
                            <p className="text-gray-600">@johndoe.eth</p>
                            <p className="text-sm text-gray-500 mt-2">Web3 Developer & Blockchain Enthusiast</p>
                        </div>
                        <div className="mt-6 space-y-3">
                            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                                Edit Profile
                            </button>
                            <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">
                                Share Profile
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                                <input
                                    type="text"
                                    defaultValue="John Doe"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    defaultValue="@johndoe.eth"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    defaultValue="john@example.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    defaultValue="San Francisco, CA"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                                rows={3}
                                defaultValue="Passionate about Web3, blockchain technology, and building the future of decentralized applications."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                                <input
                                    type="url"
                                    placeholder="https://twitter.com/username"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                                <input
                                    type="url"
                                    placeholder="https://github.com/username"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                                <input
                                    type="url"
                                    placeholder="https://linkedin.com/in/username"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Connected Wallet</label>
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">MetaMask</p>
                                        <p className="text-sm text-gray-500">0x1234...5678</p>
                                    </div>
                                </div>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Disconnect Wallet
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
