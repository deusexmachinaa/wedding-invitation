"use client";

import { PersonInfo } from "@/types";
import { SectionHeader } from "../ui/SectionHeader";
import { Phone, MessageCircle } from "lucide-react";

interface ContactInfo {
  role: string;
  name: string;
  phone: string;
}

interface ContactSectionProps {
  groom: PersonInfo;
  bride: PersonInfo;
}

export const ContactSection = ({ groom, bride }: ContactSectionProps) => {
  const groomContacts: ContactInfo[] = [
    { role: "신랑", name: groom.name, phone: groom.phone || "" },
    { role: "신랑 아버지", name: groom.father, phone: groom.fatherPhone || "" },
    { role: "신랑 어머니", name: groom.mother, phone: groom.motherPhone || "" },
  ].filter((contact) => contact.phone);

  const brideContacts: ContactInfo[] = [
    { role: "신부", name: bride.name, phone: bride.phone || "" },
    { role: "신부 아버지", name: bride.father, phone: bride.fatherPhone || "" },
    { role: "신부 어머니", name: bride.mother, phone: bride.motherPhone || "" },
  ].filter((contact) => contact.phone);

  const ContactCard = ({
    title,
    contacts,
  }: {
    title: string;
    contacts: ContactInfo[];
  }) => (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-rose-100">
      <h3 className="text-lg font-bold mb-6 text-center text-gray-800 border-b border-rose-200 pb-2">
        {title}
      </h3>
      <div className="space-y-4">
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex flex-col min-w-0 flex-1">
              <div className="text-sm text-gray-500 mb-1">{contact.role}</div>
              <div className="font-medium text-gray-800">{contact.name}</div>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <a
                href={`tel:${contact.phone}`}
                className="p-2 hover:bg-rose-100 rounded-full transition-colors text-rose-600"
                aria-label={`${contact.name}에게 전화걸기`}
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`sms:${contact.phone}`}
                className="p-2 hover:bg-rose-100 rounded-full transition-colors text-rose-600"
                aria-label={`${contact.name}에게 문자보내기`}
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        <SectionHeader englishTitle="CONTACT" koreanTitle="연락처" />

        {/* 안내 메시지 */}
        <div className="text-center mb-8 px-4">
          <p
            className="text-base text-gray-700 leading-relaxed"
            style={{
              fontFamily:
                "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
            }}
          >
            <span className="text-pink-400 font-semibold">
              축하 메시지를 전해주세요.
            </span>
            <br />
            <span className="text-pink-400 font-semibold">
              언제든지 연락 부탁드립니다.
            </span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <ContactCard title="신랑측" contacts={groomContacts} />
          <ContactCard title="신부측" contacts={brideContacts} />
        </div>
      </div>
    </section>
  );
};
