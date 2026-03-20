import { Link } from "react-router-dom";
import { FileText, ShieldCheck, Cookie, Search } from "lucide-react";
import { useState } from "react";

const legalLinks = [
  {
    title: "Terms of Service",
    path: "/terms-of-use",
    icon: FileText,
    keywords: ["terms", "service", "agreement"],
  },
  {
    title: "Cookies Policy",
    path: "/cookies-policy",
    icon: Cookie,
    keywords: ["cookies", "tracking", "browser"],
  },
  {
    title: "Privacy Policy",
    path: "/privacy-policy",
    icon: ShieldCheck,
    keywords: ["privacy", "data", "security"],
  },
];

export default function LegalCenter() {
//   const location = useLocation();
  const [query, setQuery] = useState("");

  const filteredLinks = legalLinks.filter(link =>
    link.title.toLowerCase().includes(query.toLowerCase()) ||
    link.keywords.some(k => k.includes(query.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 🔹 Breadcrumb */}
      <nav className="mb-6 text-xs text-gray-500">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Legal Center</span>
      </nav>

      {/* 🔹 Header */}
      <div className="flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">
          Clixma Supply Chain Limited (CSL) Legal Center
        </h2>

        <p className="mt-4 max-w-xl text-xs md:text-sm text-gray-600">
          Find all our legal resources, policies, and compliance information in one place.
        </p>

        {/* 🔍 Search */}
        <div className="relative mt-6 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search legal documents..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm
                       focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          />
        </div>
      </div>

      {/* 📄 Legal Links */}
      <div className="mt-4 flex flex-col md:flex-row gap-3 items-center justify-center">
        {filteredLinks.map(({ title, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`group flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 transition
              hover:border-brand-600 hover:bg-brand-50`}
          >
            <div className="flex items-center justify-center rounded-md bg-brand-100 text-brand-600">
              <Icon className="h-5 w-5" />
            </div>

            <span className="text-sm font-medium text-gray-800 group-hover:text-brand-700">
              {title}
            </span>
          </Link>
        ))}

        {filteredLinks.length === 0 && (
          <p className="col-span-full text-center text-sm text-gray-500">
            No legal documents found.
          </p>
        )}
      </div>
    </div>
  );
}
