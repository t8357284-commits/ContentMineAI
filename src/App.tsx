import { useState } from "react";
import api from "./services/api";

type ScriptItem = {
  hook: string;
  scene: string;
  script: string;
  cta: string;
};

type GeneratedContent = {
  x_posts: string[];
  linkedin_posts: string[];
  reels_scripts: ScriptItem[];
  tiktok_scripts: ScriptItem[];
};

type GenerateResponse = {
  id: string;
  metadata: {
    filename: string;
    file_type: string;
    characters: number;
    words: number;
  };
  knowledge: string;
  content: GeneratedContent;
};

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!file) {
      setError("يرجى اختيار ملف أولاً");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        "/knowledge/generate-content",
        formData,
        {
          params: {
            language: "Arabic",
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 300000,
        }
      );

      setResult(response.data.data);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء توليد المحتوى");
    } finally {
      setLoading(false);
    }
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 p-6">
        <h1 className="text-3xl font-bold">ContentMineAI</h1>
        <p className="text-slate-400 mt-2">
          منصة استخراج المعرفة وتحويل الملفات إلى محتوى جاهز للنشر
        </p>
      </header>

      <main className="p-6 md:p-10 max-w-6xl mx-auto">
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">رفع ملف جديد</h2>

          <p className="text-slate-400 mb-6">
            ارفع ملف TXT أو PDF أو DOCX وسيتم استخراج المعرفة وتحويلها إلى منشورات وسكربتات.
          </p>

          <input
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
          />

          {file && (
            <p className="mt-3 text-sm text-slate-400">
              الملف المختار: {file.name}
            </p>
          )}

          {error && (
            <div className="mt-4 bg-red-950 border border-red-800 text-red-200 p-4 rounded-xl">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 px-8 py-3 rounded-xl font-bold"
          >
            {loading ? "جاري التوليد..." : "توليد المحتوى"}
          </button>
        </section>

        {loading && (
          <section className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <p className="text-slate-300">
              جاري استخراج المعرفة وتوليد المحتوى، قد يستغرق الأمر بعض الوقت...
            </p>
          </section>
        )}

        {result && (
          <section className="mt-8 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">نتيجة التوليد</h2>

              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="bg-slate-800 p-4 rounded-xl">
                  <p className="text-slate-400">اسم الملف</p>
                  <p>{result.metadata.filename}</p>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl">
                  <p className="text-slate-400">النوع</p>
                  <p>{result.metadata.file_type}</p>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl">
                  <p className="text-slate-400">الكلمات</p>
                  <p>{result.metadata.words}</p>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl">
                  <p className="text-slate-400">المعرّف</p>
                  <p className="break-all">{result.id}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">المعرفة المستخرجة</h3>
              <p className="whitespace-pre-wrap leading-8 text-slate-200">
                {result.knowledge}
              </p>
            </div>

            <ContentSection
              title="منشورات إكس"
              items={result.content.x_posts}
              onCopy={copyText}
            />

            <ContentSection
              title="منشورات لينكدإن"
              items={result.content.linkedin_posts}
              onCopy={copyText}
            />

            <ScriptSection
              title="سكربتات Reels"
              items={result.content.reels_scripts}
              onCopy={copyText}
            />

            <ScriptSection
              title="سكربتات TikTok"
              items={result.content.tiktok_scripts}
              onCopy={copyText}
            />
          </section>
        )}
      </main>
    </div>
  );
}

function ContentSection({
  title,
  items,
  onCopy,
}: {
  title: string;
  items: string[];
  onCopy: (text: string) => void;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
      <h3 className="text-xl font-bold mb-4">{title}</h3>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="bg-slate-800 rounded-xl p-5">
            <p className="leading-8 text-slate-100">{item}</p>

            <button
              onClick={() => onCopy(item)}
              className="mt-4 text-sm bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
            >
              نسخ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScriptSection({
  title,
  items,
  onCopy,
}: {
  title: string;
  items: ScriptItem[];
  onCopy: (text: string) => void;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
      <h3 className="text-xl font-bold mb-4">{title}</h3>

      <div className="space-y-4">
        {items.map((item, index) => {
          const fullText = `
الافتتاحية: ${item.hook}
المشهد: ${item.scene}
النص: ${item.script}
الدعوة: ${item.cta}
          `.trim();

          return (
            <div key={index} className="bg-slate-800 rounded-xl p-5">
              <p className="font-bold text-blue-300 mb-2">{item.hook}</p>
              <p className="text-slate-400 mb-2">المشهد: {item.scene}</p>
              <p className="leading-8 text-slate-100">{item.script}</p>
              <p className="text-green-300 mt-2">{item.cta}</p>

              <button
                onClick={() => onCopy(fullText)}
                className="mt-4 text-sm bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
              >
                نسخ السكربت
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
