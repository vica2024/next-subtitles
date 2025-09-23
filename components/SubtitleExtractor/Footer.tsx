export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-700 bg-black/80 py-6 text-center text-sm text-gray-400">
      <p>
        © {new Date().getFullYear()} CapCut Subtitle Extractor. 
        Built with ❤️ using Next.js.
      </p>
      <p className="mt-1">
        Author: Niigelog | Not affiliated with CapCut/Bytedance.
      </p>
    </footer>
  );
}
