"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaTelegram,
  FaReddit,
  FaGoogle,
  FaThreads,
  FaPinterestP,
} from "react-icons/fa6";
import { IoIosArrowUp } from "react-icons/io";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { HiOutlineMapPin } from "react-icons/hi2";

import Logo from "@/components/logo";
import { FloatButton } from "antd";

const socialIcons: Record<string, { icon: React.ElementType; label: string }> =
  {
    google: { icon: FaGoogle, label: "Google" },
    whatsapp: { icon: FaWhatsapp, label: "WhatsApp" },
    facebook: { icon: FaFacebookF, label: "Facebook" },
    instagram: { icon: FaInstagram, label: "Instagram" },
    twitter: { icon: FaXTwitter, label: "X" },
    linkedin: { icon: FaLinkedinIn, label: "LinkedIn" },
    youtube: { icon: FaYoutube, label: "YouTube" },
    telegram: { icon: FaTelegram, label: "Telegram" },
    reddit: { icon: FaReddit, label: "Reddit" },
    threads: { icon: FaThreads, label: "Threads" },
    pinterest: { icon: FaPinterestP, label: "Pinterest" },
  };

const Footer = (props: any) => {
  const settings = props?.settings?.app || {};
  const contact = props?.settings?.contact || {};
  const editor = props?.settings?.default_editor || {};
  const pages = props?.masterdata?.data?.pages || [];

  const [scrollHeight, setScrollHeight] = useState(0);

  const handleScroll = () => {
    setScrollHeight(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeSocials = Object.entries(socialIcons).filter(
    ([key]) => contact[key],
  );

  return (
    <footer className=" border-t border-gray-400/20 bg-linear-to-tr from-primary/5 via-gray-400/10 to-gray-400/10">
      <div className="max-w-7xl mx-auto px-6 py-12 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo
              lightSrc={settings?.logo_light}
              darkSrc={settings?.logo_dark}
              className="w-46 h-11 mb-4 text-sm"
            />
            {settings?.tagline && (
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                {settings.tagline}
              </p>
            )}
            {activeSocials.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {activeSocials.map(([key, { icon: Icon, label }]) => (
                  <Link
                    key={key}
                    href={contact[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    prefetch={false}
                    className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-slate-500/20 text-(--foreground)!"
                  >
                    <Icon size={15} />
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            {pages.length > 0 && (
              <ul className="space-y-2.5 text-gray-500">
                {pages?.map((page: any) => (
                  <li
                    key={page._id ?? page.title}
                    className="flex items-center gap-2.5 hover:text-primary "
                  >
                    <Link href={`/page/${page.permalink}`} className="text-sm">
                      {page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-gray-500">
              {contact?.email && (
                <li>
                  <Link
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2.5 hover:text-primary "
                  >
                    <HiOutlineMail size={16} className="shrink-0 mt-0.5" />
                    {contact.email}
                  </Link>
                </li>
              )}
              {contact?.phone && (
                <li>
                  <Link
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2.5 hover:text-primary "
                  >
                    <HiOutlinePhone size={16} className="shrink-0 mt-0.5" />
                    {contact.phone}
                  </Link>
                </li>
              )}
              {contact?.address && (
                <li className="flex items-start gap-2.5 hover:text-primary ">
                  <HiOutlineMapPin size={16} className="shrink-0 mt-0.5" />
                  <span>{contact.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {editor?.disclaimer && (
          <div className="mt-10 pt-4 border-t border-gray-400/40">
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              {editor.disclaimer}
            </p>
          </div>
        )}
      </div>
      <div className="border-t border-gray-400/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} {settings?.name || process.env?.NEXT_PUBLIC_NAME ||"Website"}. All
            rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/login" className="text-xs hover:text-primary">
              Sign in
            </Link>
            <Link href="/register" className="text-xs hover:text-primary">
              Register
            </Link>
          </div>
        </div>
      </div>
      {scrollHeight >= 500 && (
        <FloatButton
          icon={<IoIosArrowUp size={20} />}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
      )}
    </footer>
  );
};

export default Footer;
