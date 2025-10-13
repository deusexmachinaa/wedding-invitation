"use client";

import { AccountInfo } from "@/types";
import { SectionHeader } from "../ui/SectionHeader";
import { useState } from "react";

interface AccountSectionProps {
  groomAccounts: AccountInfo[];
  brideAccounts: AccountInfo[];
  groomName: string;
  brideName: string;
}

export const AccountSection = ({
  groomAccounts,
  brideAccounts,
}: AccountSectionProps) => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopyAccount = async (
    bank: string,
    accountNumber: string,
    index: number,
    type: "groom" | "bride"
  ) => {
    try {
      await navigator.clipboard.writeText(`${bank} ${accountNumber}`);
      const key = `${type}-${index}`;
      setCopiedIndex(key);
      setTimeout(() => setCopiedIndex(null), 1000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };
  return (
    <section className="py-16 px-6 bg-rose-50">
      <div className="max-w-2xl mx-auto">
        <SectionHeader englishTitle="ACCOUNT" koreanTitle="마음 전하실 곳" />

        <div className="grid md:grid-cols-2 gap-8">
          {/* 신랑측 */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
              신랑측 계좌번호
            </h3>
            <div className="space-y-3">
              {groomAccounts.map((account, index) => {
                const key = `groom-${index}`;
                const isCopied = copiedIndex === key;
                return (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800">
                          {account.accountHolder}
                        </div>
                        <div className="text-sm text-gray-600">
                          {account.bank} {account.accountNumber}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleCopyAccount(
                            account.bank,
                            account.accountNumber,
                            index,
                            "groom"
                          )
                        }
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          isCopied
                            ? "bg-green-100 text-green-600"
                            : "bg-rose-100 text-rose-600 hover:bg-rose-200"
                        }`}
                      >
                        {isCopied ? "복사완료" : "복사"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 신부측 */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
              신부측 계좌번호
            </h3>
            <div className="space-y-3">
              {brideAccounts.map((account, index) => {
                const key = `bride-${index}`;
                const isCopied = copiedIndex === key;
                return (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800">
                          {account.accountHolder}
                        </div>
                        <div className="text-sm text-gray-600">
                          {account.bank} {account.accountNumber}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleCopyAccount(
                            account.bank,
                            account.accountNumber,
                            index,
                            "bride"
                          )
                        }
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          isCopied
                            ? "bg-green-100 text-green-600"
                            : "bg-rose-100 text-rose-600 hover:bg-rose-200"
                        }`}
                      >
                        {isCopied ? "복사완료" : "복사"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          참석이 어려우신 분들을 위해 계좌번호를 기재하였습니다.
          <br />
          너그러운 마음으로 양해 부탁드립니다.
        </p>
      </div>
    </section>
  );
};
