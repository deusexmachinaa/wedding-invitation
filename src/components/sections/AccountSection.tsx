"use client";

import { AccountInfo } from "@/types";
import { SectionHeader } from "../ui/SectionHeader";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";

interface AccountSectionProps {
  groomAccounts: AccountInfo[];
  brideAccounts: AccountInfo[];
  groomName: string;
  brideName: string;
}

interface AccountCardProps {
  account: AccountInfo;
  index: number;
  type: "groom" | "bride";
  isCopied: boolean;
  isExpanded: boolean;
  onCopy: (
    bank: string,
    accountNumber: string,
    index: number,
    type: "groom" | "bride"
  ) => void;
  onToggleExpand: (key: string) => void;
  onKakaoTransfer: (
    bank: string,
    accountNumber: string,
    accountHolder: string,
    kakaoPayLink?: string
  ) => void;
  onTossTransfer: (
    bank: string,
    accountNumber: string,
    accountHolder: string
  ) => void;
}

// 계좌 카드 컴포넌트
const AccountCard = ({
  account,
  index,
  type,
  isCopied,
  isExpanded,
  onCopy,
  onToggleExpand,
  onKakaoTransfer,
  onTossTransfer,
}: AccountCardProps) => {
  const key = `${type}-${index}`;
  const hasTransferButtons = account.enableKakaoPay || account.enableToss;

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
                onCopy(account.bank, account.accountNumber, index, type)
              }
              className={`px-3 py-1 rounded text-sm transition-colors ${
                isCopied
                  ? "bg-green-100 text-green-600"
                  : "bg-rose-100 text-rose-600 hover:bg-rose-200"
              }`}
            >
              {isCopied ? "복사완료" : "복사"}
            </button>
            {hasTransferButtons && (
              <motion.button
                onClick={() => onToggleExpand(key)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {hasTransferButtons && (
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
                  {account.enableKakaoPay && (
                    <button
                      onClick={() =>
                        onKakaoTransfer(
                          account.bank,
                          account.accountNumber,
                          account.accountHolder,
                          account.kakaoPayLink
                        )
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#FEE500] hover:bg-[#FDD835] rounded-lg font-medium text-sm transition-all hover:scale-105 active:scale-95"
                    >
                      <Image
                        src="/icons/kakaopay.png"
                        alt="카카오페이"
                        width={32}
                        height={13}
                      />
                      <span className="text-[#3C1E1E] font-semibold">
                        카카오페이
                      </span>
                    </button>
                  )}
                  {account.enableToss && (
                    <button
                      onClick={() =>
                        onTossTransfer(
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
                        width={32}
                        height={16}
                      />
                      <span className="text-white font-semibold">토스</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export const AccountSection = ({
  groomAccounts,
  brideAccounts,
}: AccountSectionProps) => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

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
    accountHolder: string,
    kakaoPayLink?: string
  ) => {
    const copyText = `${bank} ${accountNumber}`;

    // 모바일 환경 감지
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && kakaoPayLink) {
      // 모바일에서 링크가 있으면 새 창으로 열기
      window.open(kakaoPayLink, "_blank");
    } else {
      // PC이거나 링크가 없으면 은행명과 계좌번호 복사
      navigator.clipboard.writeText(copyText);
      Swal.fire({
        title: "카카오페이",
        html: `<div style="line-height: 1.8">
          <strong>${bank}</strong><br/>
          계좌번호: ${accountNumber}<br/>
          예금주: ${accountHolder}<br/><br/>
          ${
            isMobile
              ? "카카오페이 정보가 없습니다.<br/>계좌번호가 복사되었습니다."
              : "모바일에서 접속하시면 카카오페이 앱으로<br/>바로 이동할 수 있습니다.<br/>계좌번호가 복사되었습니다."
          }
        </div>`,
        icon: "info",
        confirmButtonText: "확인",
        confirmButtonColor: "#FEE500",
      });
    }
  };

  const handleTossTransfer = (
    bank: string,
    accountNumber: string,
    accountHolder: string
  ) => {
    const cleanAccountNumber = accountNumber.replace(/-/g, "");

    // 토스에서 사용하는 은행 이름 매핑
    const getBankNameForToss = (bankName: string): string => {
      const bankMapping: { [key: string]: string } = {
        농협: "NH농협은행",
        NH농협: "NH농협은행",
        KB: "KB국민은행",
        국민은행: "KB국민은행",
        신한은행: "신한은행",
        우리은행: "우리은행",
        하나은행: "하나은행",
        기업은행: "IBK기업은행",
        IBK기업은행: "IBK기업은행",
        SC제일은행: "SC제일은행",
        카카오뱅크: "카카오뱅크",
        케이뱅크: "케이뱅크",
        토스: "토스뱅크",
        토스뱅크: "토스뱅크",
        대구은행: "대구은행",
        iM뱅크: "대구은행",
        부산은행: "부산은행",
        경남은행: "경남은행",
        광주은행: "광주은행",
        전북은행: "전북은행",
        제주은행: "제주은행",
        수협은행: "수협은행",
        새마을금고: "새마을금고",
        신협: "신협",
        우체국: "우체국",
      };

      return bankMapping[bankName] || bankName;
    };

    // 모바일 환경 감지
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // 토스 송금 딥링크 (은행 이름을 URL 인코딩)
      const bankName = getBankNameForToss(bank);
      const tossUrl = `supertoss://send?amount=0&bank=${encodeURIComponent(
        bankName
      )}&accountNo=${cleanAccountNumber}`;

      let appOpened = false;

      // 페이지 가시성 변경 감지 (앱이 실행되면 페이지가 숨겨짐)
      const handleVisibilityChange = () => {
        if (document.hidden) {
          appOpened = true;
          clearTimeout(fallbackTimer);
        }
      };

      // blur 이벤트로 앱 실행 감지
      const handleBlur = () => {
        appOpened = true;
        clearTimeout(fallbackTimer);
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("blur", handleBlur);

      // 토스 앱으로 이동 시도
      window.location.href = tossUrl;

      // 앱이 없을 경우 폴백 (2초 후)
      const fallbackTimer = setTimeout(() => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        window.removeEventListener("blur", handleBlur);

        if (!appOpened) {
          const copyText = `${bank} ${accountNumber}`;
          navigator.clipboard.writeText(copyText);
          Swal.fire({
            title: "토스 앱을 찾을 수 없습니다",
            html: `<div style="line-height: 1.8">
              계좌번호가 복사되었습니다.<br/><br/>
              <strong>${bank}</strong><br/>
              계좌번호: ${accountNumber}<br/>
              예금주: ${accountHolder}
            </div>`,
            icon: "info",
            confirmButtonText: "확인",
            confirmButtonColor: "#0064FF",
          });
        }
      }, 2000);
    } else {
      // PC에서 접속한 경우
      const copyText = `${bank} ${accountNumber}`;
      navigator.clipboard.writeText(copyText);
      Swal.fire({
        title: "토스 송금",
        html: `<div style="line-height: 1.8">
          <strong>${bank}</strong><br/>
          계좌번호: ${accountNumber}<br/>
          예금주: ${accountHolder}<br/><br/>
          모바일에서 접속하시면 토스 앱으로<br/>
          바로 이동할 수 있습니다.<br/>
          계좌번호가 복사되었습니다.
        </div>`,
        icon: "info",
        confirmButtonText: "확인",
        confirmButtonColor: "#0064FF",
      });
    }
  };
  // 계좌 목록 렌더링 헬퍼 함수
  const renderAccountList = (
    accounts: AccountInfo[],
    type: "groom" | "bride",
    title: string
  ) => (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
        {title}
      </h3>
      <div className="space-y-3">
        {accounts.map((account, index) => {
          const key = `${type}-${index}`;
          const isCopied = copiedIndex === key;
          const isExpanded = expandedIndex === key;
          return (
            <AccountCard
              key={key}
              account={account}
              index={index}
              type={type}
              isCopied={isCopied}
              isExpanded={isExpanded}
              onCopy={handleCopyAccount}
              onToggleExpand={toggleExpanded}
              onKakaoTransfer={handleKakaoTransfer}
              onTossTransfer={handleTossTransfer}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <section className="py-16 px-6 bg-rose-50">
      <div className="max-w-2xl mx-auto">
        <SectionHeader englishTitle="ACCOUNT" koreanTitle="마음 전하실 곳" />

        <div className="grid md:grid-cols-2 gap-8">
          {renderAccountList(groomAccounts, "groom", "신랑측")}
          {renderAccountList(brideAccounts, "bride", "신부측")}
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
