function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <header className="border-b border-slate-800 p-6">
        <h1 className="text-3xl font-bold">
          ContentMineAI
        </h1>

        <p className="text-slate-400 mt-2">
          منصة استخراج المعرفة وتحويلها إلى محتوى احترافي
        </p>
      </header>

      <main className="p-10">

        <div className="bg-slate-900 rounded-xl p-8 max-w-4xl mx-auto">

          <h2 className="text-2xl font-bold mb-4">
            رفع ملف
          </h2>

          <input
            type="file"
            className="block w-full p-3 rounded bg-slate-800"
          />

          <button
            className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
          >
            توليد المحتوى
          </button>

        </div>

      </main>

    </div>
  );
}

export default App;
