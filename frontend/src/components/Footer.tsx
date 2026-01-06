export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Links */}
          <div className="flex items-center gap-8">
            <a href="#terms" className="text-gray-600 hover:text-gray-900 transition-colors">
              Terms
            </a>
            <a href="#privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
              Privacy
            </a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </a>
          </div>

          {/* Copyright */}
          <div className="text-gray-500">
            © 2025 TBA Surrogacy Escrow
          </div>
        </div>
      </div>
    </footer>
  );
}