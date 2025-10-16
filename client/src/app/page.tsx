import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-8 space-y-8">
      {/* Heading section */}
      <section className="text-center">
        <Image src='/assets/logo.svg' alt="Logo" width={100} height={100} />
        <h1 className="text-4xl font-heading text-primary mb-2">
          Welcome to HuddleUp Protocol 🎉
        </h1>
        <h2 className="text-lg text-secondary font-body">
          Test Page — Verifying Tailwind + Fonts + Theme Colors
        </h2>
      </section>

      {/* Color demo boxes */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl bg-primary text-white font-body shadow-md">
          Primary
        </div>
        <div className="p-6 rounded-xl bg-secondary text-dark font-body shadow-md">
          Secondary
        </div>
        <div className="p-6 rounded-xl bg-success text-white font-body shadow-md">
          Success
        </div>
        <div className="p-6 rounded-xl bg-danger text-white font-body shadow-md">
          Danger
        </div>
        <div className="p-6 rounded-xl bg-warning text-dark font-body shadow-md">
          Warning
        </div>
        <div className="p-6 rounded-xl bg-info text-white font-body shadow-md">
          Info
        </div>
        <div className="p-6 rounded-xl bg-neutral text-white font-body shadow-md">
          Neutral
        </div>
        <div className="p-6 rounded-xl bg-dark text-white font-body shadow-md">
          Dark
        </div>
      </section>

      {/* Button demo */}
      <section className="flex flex-wrap gap-4">
        <button className="bg-primary text-white px-6 py-2 rounded-lg font-heading hover:bg-indigo-700 transition">
          Primary Button
        </button>
        <button className="bg-danger text-white px-6 py-2 rounded-lg font-heading hover:bg-red-700 transition">
          Danger Button
        </button>
        <button className="bg-success text-white px-6 py-2 rounded-lg font-heading hover:bg-green-700 transition">
          Success Button
        </button>
        <button className="bg-warning text-dark px-6 py-2 rounded-lg font-heading hover:bg-amber-600 transition">
          Warning Button
        </button>
      </section>

      {/* Paragraph demo */}
      <section className="max-w-xl text-center">
        <p className="text-primary font-body leading-relaxed">
          This is a sample paragraph using the <strong>Inter</strong> font for body text.
          Headings above use <strong>Montserrat</strong>.  
          If you see proper spacing, rounded boxes, and different colors — your Tailwind and theme configuration are working correctly ✅
        </p>
      </section>
    </main>
  );
}
