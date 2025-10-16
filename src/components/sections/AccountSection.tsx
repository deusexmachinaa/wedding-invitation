"use client";

import { AccountInfo } from "@/types";
import { SectionHeader } from "../ui/SectionHeader";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

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
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  // 한국 은행 코드 매핑
  const bankCodeMap: { [key: string]: string } = {
    KB국민은행: "004",
    국민은행: "004",
    신한은행: "088",
    우리은행: "020",
    하나은행: "081",
    NH농협: "011",
    농협: "011",
    SC제일은행: "023",
    한국씨티은행: "027",
    KEB하나은행: "081",
    카카오뱅크: "090",
    케이뱅크: "089",
    토스뱅크: "092",
    대구은행: "031",
    iM뱅크: "031",
    부산은행: "032",
    경남은행: "039",
    광주은행: "034",
    전북은행: "037",
    제주은행: "035",
    IBK기업은행: "003",
    기업은행: "003",
    수협은행: "007",
    새마을금고: "045",
    신협: "048",
    우체국: "071",
  };

  const getBankCode = (bankName: string): string => {
    return bankCodeMap[bankName] || "004"; // 기본값: 국민은행
  };

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

  const toggleExpanded = (key: string) => {
    setExpandedIndex(expandedIndex === key ? null : key);
  };

  const handleKakaoTransfer = (
    bank: string,
    accountNumber: string,
    accountHolder: string
  ) => {
    const bankCode = getBankCode(bank);
    const cleanAccountNumber = accountNumber.replace(/-/g, "");

    // 모바일 환경 감지
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // 카카오페이 송금 딥링크
      const kakaoPayUrl = `https://qr.kakaopay.com/Fd08af96a8beb71f6b1c1c38a1e0a13eb`;

      alert(
        `카카오페이 송금\n\n${bank} (${bankCode})\n계좌번호: ${accountNumber}\n예금주: ${accountHolder}\n\n계좌번호가 복사되었습니다.\n카카오페이 앱에서 송금해주세요.`
      );
      navigator.clipboard.writeText(accountNumber);
    } else {
      alert(
        `카카오페이 송금\n\n${bank} (${bankCode})\n계좌번호: ${accountNumber}\n예금주: ${accountHolder}\n\n모바일에서 접속하시면 카카오페이 앱으로 바로 이동할 수 있습니다.\n계좌번호가 복사되었습니다.`
      );
      navigator.clipboard.writeText(accountNumber);
    }
  };

  const handleTossTransfer = (
    bank: string,
    accountNumber: string,
    accountHolder: string
  ) => {
    const bankCode = getBankCode(bank);
    const cleanAccountNumber = accountNumber.replace(/-/g, "");

    // 모바일 환경 감지
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // 토스 송금 딥링크 (실제 딥링크)
      const tossUrl = `supertoss://send?bank=${bankCode}&accountNo=${cleanAccountNumber}&name=${encodeURIComponent(
        accountHolder
      )}`;

      // 토스 앱으로 이동 시도
      window.location.href = tossUrl;

      // 앱이 없을 경우 폴백 (1.5초 후)
      setTimeout(() => {
        const fallbackUrl = "https://toss.im/transfer";
        if (
          confirm(
            "토스 앱이 설치되어 있지 않습니다.\n토스 다운로드 페이지로 이동하시겠습니까?"
          )
        ) {
          window.location.href = fallbackUrl;
        } else {
          navigator.clipboard.writeText(accountNumber);
          alert("계좌번호가 복사되었습니다.");
        }
      }, 1500);
    } else {
      // PC에서 접속한 경우
      alert(
        `토스 송금\n\n${bank} (${bankCode})\n계좌번호: ${accountNumber}\n예금주: ${accountHolder}\n\n모바일에서 접속하시면 토스 앱으로 바로 이동할 수 있습니다.\n계좌번호가 복사되었습니다.`
      );
      navigator.clipboard.writeText(accountNumber);
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
              신랑측
            </h3>
            <div className="space-y-3">
              {groomAccounts.map((account, index) => {
                const key = `groom-${index}`;
                const isCopied = copiedIndex === key;
                const isExpanded = expandedIndex === key;
                return (
                  <motion.div
                    key={index}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                    initial={false}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">
                            {account.accountHolder}
                          </div>
                          <div className="text-sm text-gray-600">
                            {account.bank} {account.accountNumber}
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
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
                          <motion.button
                            onClick={() => toggleExpanded(key)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                            <div className="flex gap-3 mt-3">
                              <button
                                onClick={() =>
                                  handleKakaoTransfer(
                                    account.bank,
                                    account.accountNumber,
                                    account.accountHolder
                                  )
                                }
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#FEE500] hover:bg-[#FDD835] rounded-lg font-medium text-sm transition-all hover:scale-105 active:scale-95"
                              >
                                <Image
                                  src="/icons/kakaopay.png"
                                  alt="카카오페이"
                                  width={36}
                                  height={36}
                                />
                                <span className="text-[#3C1E1E] font-semibold">
                                  카카오페이
                                </span>
                              </button>
                              <button
                                onClick={() =>
                                  handleTossTransfer(
                                    account.bank,
                                    account.accountNumber,
                                    account.accountHolder
                                  )
                                }
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#0064FF] hover:bg-[#0052CC] rounded-lg font-medium text-sm transition-all hover:scale-105 active:scale-95"
                              >
                                <Image
                                  src="/icons/toss.png"
                                  alt="토스"
                                  width={36}
                                  height={36}
                                />
                                <span className="text-white font-semibold">
                                  토스
                                </span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 신부측 */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
              신부측
            </h3>
            <div className="space-y-3">
              {brideAccounts.map((account, index) => {
                const key = `bride-${index}`;
                const isCopied = copiedIndex === key;
                const isExpanded = expandedIndex === key;
                return (
                  <motion.div
                    key={index}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                    initial={false}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">
                            {account.accountHolder}
                          </div>
                          <div className="text-sm text-gray-600">
                            {account.bank} {account.accountNumber}
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
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
                          <motion.button
                            onClick={() => toggleExpanded(key)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                            <div className="flex gap-3 mt-3">
                              <button
                                onClick={() =>
                                  handleKakaoTransfer(
                                    account.bank,
                                    account.accountNumber,
                                    account.accountHolder
                                  )
                                }
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#FEE500] hover:bg-[#FDD835] rounded-lg font-medium text-sm transition-all hover:scale-105 active:scale-95"
                              >
                                <Image
                                  src="/icons/kakaopay.png"
                                  alt="카카오페이"
                                  width={36}
                                  height={36}
                                />
                                <span className="text-[#3C1E1E] font-semibold">
                                  카카오페이
                                </span>
                              </button>
                              <button
                                onClick={() =>
                                  handleTossTransfer(
                                    account.bank,
                                    account.accountNumber,
                                    account.accountHolder
                                  )
                                }
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#0064FF] hover:bg-[#0052CC] rounded-lg font-medium text-sm transition-all hover:scale-105 active:scale-95"
                              >
                                <Image
                                  src="/icons/toss.png"
                                  alt="토스"
                                  width={36}
                                  height={36}
                                />
                                <span className="text-white font-semibold">
                                  토스
                                </span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8 break-keep">
          참석이 어려우신 분들을 위해 부득이 계좌번호를 기재하였습니다.
          <br />
          너그러운 마음으로 양해 부탁드립니다.
        </p>
      </div>
    </section>
  );
};
