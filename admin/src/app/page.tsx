export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to HuddleUp Protocol
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A decentralized social protocol built for the future of Web3
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Get Started
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Social Features</h3>
          <p className="text-gray-600">
            Connect with like-minded individuals in the Web3 ecosystem through our decentralized social network.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Decentralized</h3>
          <p className="text-gray-600">
            Built on blockchain technology with Neo4j for efficient social graph management and data integrity.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast & Secure</h3>
          <p className="text-gray-600">
            Lightning-fast interactions with enterprise-grade security powered by modern Web3 infrastructure.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-6">
          Join the HuddleUp Protocol and be part of the next generation of decentralized social networking.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Connect Your Wallet
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            View Documentation
          </button>
        </div>
      </div>
    </div>
  );
}