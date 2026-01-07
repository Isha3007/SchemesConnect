"use client";

import { useState } from "react";
import { User, Bookmark, BookmarkCheck } from "lucide-react";
import Chatbot from "../chatbot/page"; 
import Profile from "../profile/page"; 
import Community from "../community/page";


interface Scheme {
  id: number;
  title: string;
  description: string;
  publishDate: string;
  category: string;
  eligibility: string;
  documents: string[];
  applyLink: string;
}

const schemes: Scheme[] = [
  {
    id: 1,
    title: "Pradhan Mantri Awas Yojana-Urban 2.0",
    description: "Ambitious housing initiative by the Government of India, aimed at ensuring affordable housing for all in urban areas.",
    publishDate: "03/04/2025",
    category: "Housing",
    eligibility: "Low-income groups, EWS, and middle-income groups living in urban areas.",
    documents: ["Aadhaar Card", "Income Certificate", "Proof of Residence"],
    applyLink: "https://pmaymis.gov.in/",
  },
  {
    id: 2,
    title: "National Scholarship Portal",
    description: "Centralized portal for students to apply for scholarships provided by various government departments and ministries.",
    publishDate: "15/06/2024",
    category: "Education",
    eligibility: "Students from minority, SC/ST, OBC, and economically weaker backgrounds.",
    documents: ["Aadhaar Card", "Income Certificate", "Previous Marksheet", "Bank Account Details"],
    applyLink: "https://scholarships.gov.in/",
  },
  {
    id: 3,
    title: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop Insurance Scheme providing financial support to farmers in case of crop failure due to natural calamities, pests, and diseases.",
    publishDate: "20/09/2024",
    category: "Farming",
    eligibility: "All farmers growing notified crops in notified areas.",
    documents: ["Aadhaar Card", "Land Ownership Papers", "Bank Account Details"],
    applyLink: "https://pmfby.gov.in/",
  },
  {
    id: 4,
    title: "Women & Child Welfare Program",
    description: "Schemes for nutrition, education, and safety of women and children across India.",
    publishDate: "12/08/2024",
    category: "Women & Child",
    eligibility: "Women and children from economically weaker sections.",
    documents: ["Aadhaar Card", "Birth Certificate", "Income Certificate"],
    applyLink: "https://wcd.nic.in/",
  },
  {
    id: 5,
    title: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana",
    description: "World’s largest health assurance scheme providing free treatment up to ₹5 lakh per family per year.",
    publishDate: "01/01/2024",
    category: "Health",
    eligibility: "Economically weaker families listed under SECC database.",
    documents: ["Aadhaar Card", "Ration Card"],
    applyLink: "https://pmjay.gov.in/",
  },
  {
    id: 6,
    title: "Pradhan Mantri Kaushal Vikas Yojana",
    description: "Flagship scheme for skill development to train youth in industry-relevant skills.",
    publishDate: "10/07/2024",
    category: "Employment",
    eligibility: "Unemployed youth, school/college dropouts.",
    documents: ["Aadhaar Card", "Educational Certificate"],
    applyLink: "https://www.pmkvyofficial.org/",
  },
  {
    id: 7,
    title: "Atal Pension Yojana",
    description: "Government-backed pension scheme for workers in the unorganized sector.",
    publishDate: "25/04/2024",
    category: "Pension",
    eligibility: "All Indian citizens between 18-40 years with a savings account.",
    documents: ["Aadhaar Card", "Bank Account Details"],
    applyLink: "https://npscra.nsdl.co.in/scheme-details.php",
  },
];

export default function CitizenDashboard() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("schemes");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const categories = ["All", "Housing", "Education", "Farming", "Women & Child", "Health", "Employment", "Pension"];

  const filteredSchemes = schemes.filter((scheme) => {
    const matchCategory = filter === "All" || scheme.category === filter;
    const matchSearch = scheme.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((bid) => bid !== id) : [...prev, id]
    );
  };
return (
  <div className="p-2 sm:p-6 w-full">
    
    {/* 🔹 App Header */}
    <header className="mb-6 sm:mb-10 text-center px-2">
      <h1 className="text-3xl sm:text-5xl font-extrabold text-indigo-700">
        SchemesConnect
      </h1>
      <p className="mt-2 text-xs sm:text-lg text-gray-600 italic">
        Connecting Citizens to Government Schemes
      </p>
    </header>

    {/* Tabs + Profile */}
    <div className="flex flex-col sm:flex-row justify-between items-center border-b mb-4 sm:mb-6 gap-2">
      
      {/* Tab Buttons */}
      <div className="flex flex-wrap sm:flex-nowrap sm:space-x-4 gap-2 justify-center sm:justify-start w-full">
        {["schemes", "community", "chatbot", "profile"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 sm:pb-2 px-2 sm:px-4 text-[10px] sm:text-base font-medium transition-all ${
              activeTab === tab
                ? "border-b-4 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-indigo-500"
            }`}
          >
            {tab === "schemes" && "Schemes"}
            {tab === "community" && "Community 💬"}
            {tab === "chatbot" && "Chatbot 🤖"}
            {tab === "profile" && "Profile 👤"}
          </button>
        ))}
      </div>

      {/* Profile Icon */}
      <div className="hidden sm:block">
        <button
          onClick={() => setActiveTab("profile")}
          className="p-2 rounded-full hover:bg-indigo-50 transition-all"
        >
          <User className="w-4 sm:w-6 h-4 sm:h-6 text-indigo-600" />
        </button>
      </div>
    </div>

    {/* Render Active Tab */}
    {activeTab === "schemes" && (
      <div className="w-full">
        <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6">
          Schemes
        </h1>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 bg-gray-100 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
          <input
            type="text"
            placeholder="🔍 Search schemes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 text-xs sm:text-base rounded-md flex-1 w-full"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 text-xs sm:text-base rounded-md w-full sm:w-auto"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Scheme Cards */}
        <div className="space-y-3 sm:space-y-6">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="border rounded-xl shadow-sm p-3 sm:p-6 bg-white text-[11px] sm:text-base"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <div>
                  <h2 className="text-sm sm:text-xl font-bold mb-2">
                    {scheme.title}
                  </h2>
                  <p className="text-gray-600 mb-2 sm:mb-3">
                    {scheme.description}
                  </p>
                  <p className="text-[9px] sm:text-sm text-gray-500">
                    Publish Date: {scheme.publishDate}
                  </p>
                </div>

                {/* Bookmark */}
                <div className="flex space-x-2 self-end sm:self-auto">
                  <button onClick={() => toggleBookmark(scheme.id)}>
                    {bookmarks.includes(scheme.id) ? (
                      <BookmarkCheck className="text-indigo-600 w-4 sm:w-6 h-4 sm:h-6" />
                    ) : (
                      <Bookmark className="text-gray-500 w-4 sm:w-6 h-4 sm:h-6" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={() =>
                  setExpanded(expanded === scheme.id ? null : scheme.id)
                }
                className="mt-2 sm:mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-[10px] sm:text-base transition-all"
              >
                {expanded === scheme.id ? "Hide Details" : "View Details"}
              </button>

              {expanded === scheme.id && (
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 border rounded-lg">
                  <p className="mb-2">
                    <span className="font-semibold">Eligibility:</span>{" "}
                    {scheme.eligibility}
                  </p>

                  <p className="mb-1 font-semibold">
                    Documents Required:
                  </p>

                  <ul className="list-disc list-inside text-gray-700 text-[10px] sm:text-base">
                    {scheme.documents.map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>

                  <p className="mt-2">
                    <span className="font-semibold">Where to Apply:</span>{" "}
                    <a
                      href={scheme.applyLink}
                      target="_blank"
                      className="text-blue-600 underline text-[9px] sm:text-base"
                    >
                      {scheme.applyLink.split("?")[0]}
                    </a>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {activeTab === "community" && <Community />}
    {activeTab === "chatbot" && <Chatbot />}
    {activeTab === "profile" && <Profile />}

    {/* Disclaimer */}
    <footer className="text-[8px] sm:text-xs text-gray-400 text-center mt-3 sm:mt-6">
      *SchemesConnect assistant may make mistakes. Always verify important information.
    </footer>
  </div>
);

}
