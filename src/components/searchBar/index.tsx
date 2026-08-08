"use client";
import { useEffect, useRef, useState } from "react";
import type { InputRef } from "antd";
import { Input, Button, Tag, Empty, Skeleton } from "antd";
import { IoClose, IoSearch } from "react-icons/io5";

import { API } from "@/config/apis";
import Tertiary from "../contentCard/tertiary";
interface SearchBarProps {
  open: boolean;
  onClose: () => void;
  categories?: any[];
}

const placeholders = [
  "Search Exams...",
  "Search Government Jobs...",
  "Find Scholarships...",
  "Check Results...",
  "Browse Vacancies...",
  "Explore Courses...",
];

export function SearchTrigger({ onClick }: { onClick: () => void }) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const current = placeholders[idx];
    if (charIdx < current.length) {
      const t = setTimeout(() => {
        setText((p) => p + current[charIdx]);
        setCharIdx((c) => c + 1);
      }, 80);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setText("");
        setCharIdx(0);
        setIdx((i) => (i + 1) % placeholders.length);
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [charIdx, idx]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClick();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClick]);

  return (
    <div onClick={onClick} className="relative w-full sm:w-2/4 cursor-pointer">
      <div className="flex items-center h-10.5 rounded-full border border-gray-500/30 px-6 pr-4 text-[14px] hover:border-primary/50 transition-colors bg-gray-200/10">
        <span className="flex-1 text-gray-400 select-none">{text || " "}</span>
        <IoSearch size={20} className="text-primary" />
      </div>
    </div>
  );
}

export default function SearchBar({
  open,
  onClose,
  categories = [],
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
      abortRef.current?.abort();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const search = (q: string) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim() || q.trim().length < 3) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        setLoading(true);
        const url = `${API.BASE}/api/${API.GET_CONTENT_FILTERS}?page=1&limit=6&title=${encodeURIComponent(q.trim())}`;
        const res = await fetch(url, { signal: controller.signal });
        const json = await res.json();
        setResults(json?.status && Array.isArray(json?.data) ? json.data : []);
      } catch (e: any) {
        if (e?.name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-start sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full h-full sm:h-[70vh] sm:max-w-xl sm:mx-4 bg-(--background) sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-500/20">
        <div className="p-2 sm:p-2 border-b border-gray-500/20">
          <Input
            ref={inputRef}
            size="large"
            prefix={<IoSearch size={18} className="text-gray-400 mr-2" />}
            suffix={
              <Button
                type="text"
                shape="circle"
                aria-label="Close search"
                onClick={onClose}
              >
                <IoClose size={20} />
              </Button>
            }
            placeholder="Search articles..."
            value={query}
            onChange={(e) => search(e.target.value)}
            variant="borderless"
            className="text-base!"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {query.trim() && loading ? (
            <div className="p-4">
              <Skeleton active />
            </div>
          ) : query.trim() && results.length > 0 ? (
            <div>
              {results.map((item: any, index: number) => (
                <div
                  key={item?._id || index}
                  className={`  p-4 ${index !== results.length - 1 ? "border-b border-slate-500/30" : ""}`}
                  onClick={onClose}
                >
                  <Tertiary item={item} />
                </div>
              ))}
            </div>
          ) : Number(query.trim()) > 3 && !loading && results.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No results found"
              className="py-10!"
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-14 sm:py-20 px-6">
              <style>{`
                @keyframes s-ring{0%{transform:scale(.8);opacity:.5}100%{transform:scale(1.8);opacity:0}}
                @keyframes s-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
                @keyframes s-fade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
              `}</style>
              <div className="relative w-20 h-20 mb-8">
                <div
                  className="absolute inset-0 rounded-full bg-primary/15"
                  style={{ animation: "s-ring 2.5s ease-out infinite" }}
                />
                <div
                  className="absolute inset-0 rounded-full bg-primary/10"
                  style={{ animation: "s-ring 2.5s ease-out 0.8s infinite" }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ animation: "s-float 3s ease-in-out infinite" }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center backdrop-blur-sm">
                    <IoSearch size={26} className="text-primary" />
                  </div>
                </div>
              </div>
              <p className="text-base font-semibold mb-4">Search articles</p>

              <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                {categories.map((cat: any, i: number) => (
                  <Tag
                    key={cat._id || cat.value || i}
                    variant="filled"
                    onClick={() => search(cat.label || cat.value)}
                  >
                    {cat.label || cat.value}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
