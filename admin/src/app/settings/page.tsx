export default function Settings() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-600">Manage your account and application preferences</p>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Notifications</label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="email-notifications"
                                    defaultChecked
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="email-notifications" className="text-sm text-gray-700">
                                    Receive email notifications for new connections and messages
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Push Notifications</label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="push-notifications"
                                    defaultChecked
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="push-notifications" className="text-sm text-gray-700">
                                    Enable push notifications in browser
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Visibility</label>
                            <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Public</option>
                                <option>Friends Only</option>
                                <option>Private</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Show Online Status</label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="online-status"
                                    defaultChecked
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="online-status" className="text-sm text-gray-700">
                                    Let others see when you&apos;re online
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Allow Direct Messages</label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="direct-messages"
                                    defaultChecked
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="direct-messages" className="text-sm text-gray-700">
                                    Allow others to send you direct messages
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data Sharing</label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="data-sharing"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="data-sharing" className="text-sm text-gray-700">
                                    Share anonymous usage data to improve the platform
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Two-Factor Authentication</label>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">Add an extra layer of security to your account</p>
                                </div>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                                    Enable 2FA
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Session Management</label>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">Manage your active sessions</p>
                                </div>
                                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors">
                                    View Sessions
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Change Password</label>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">Update your account password</p>
                                </div>
                                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                            <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Light</option>
                                <option>Dark</option>
                                <option>System</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                            <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>German</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                            <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>UTC-8 (Pacific Time)</option>
                                <option>UTC-5 (Eastern Time)</option>
                                <option>UTC+0 (GMT)</option>
                                <option>UTC+1 (Central European Time)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                            <div>
                                <h4 className="font-medium text-red-900">Delete Account</h4>
                                <p className="text-sm text-red-700">Permanently delete your account and all associated data</p>
                            </div>
                            <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors">
                                Delete Account
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div>
                                <h4 className="font-medium text-yellow-900">Export Data</h4>
                                <p className="text-sm text-yellow-700">Download a copy of your data</p>
                            </div>
                            <button className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-700 transition-colors">
                                Export Data
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
