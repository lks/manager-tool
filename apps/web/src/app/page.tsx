export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Manager Tool</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Modern web application skeleton
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="/health"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Check API Health
        </a>
      </div>
    </main>
  )
}
