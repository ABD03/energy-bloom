"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <div className="max-w-7xl mx-auto  p-3 font-sans">
      <div className="flex flex-col md:flex-row gap-4 align-center justify-center mb-3 text-xs">
        <div>
          <Link href="/login">Login</Link>
        </div>
        <div>
          <Link href="/">Terms and Conditions</Link>
        </div>
        <div>
          <Link href="/">Privacy Policy</Link>
        </div>
        <div>
          <Link href="/">Cookie Policy</Link>
        </div>
        <div>
          <Link href="/">Contact Us</Link>
        </div>
      </div>
      <div className="text-center text-xs border-t border-t-indigo-50 pt-3 text-gray-500">
        Copyright © 2010-2025
      </div>
    </div>
  );
}
