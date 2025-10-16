"use client";

import { useState, useEffect } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
  is_groom: boolean;
}

export const GuestbookSection = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [isGroom, setIsGroom] = useState(true);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hash password using SHA-256
  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  // Load guestbook entries from Supabase
  useEffect(() => {
    loadGuestbook();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("guestbook_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "guestbook",
        },
        () => {
          loadGuestbook();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadGuestbook = async () => {
    try {
      const { data, error } = await supabase
        .from("guestbook")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading guestbook:", error);
        return;
      }

      setEntries(data || []);
    } catch (error) {
      console.error("Error loading guestbook:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !message.trim()) {
      Swal.fire({
        title: "입력 필요",
        text: "성함과 메시지를 모두 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#f472b6",
      });
      return;
    }

    if (!password.trim()) {
      Swal.fire({
        title: "비밀번호 필요",
        text: "삭제를 위한 비밀번호를 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#f472b6",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const passwordHash = await hashPassword(password);

      const { error } = await supabase.from("guestbook").insert([
        {
          name: name.trim(),
          message: message.trim(),
          is_groom: isGroom,
          password_hash: passwordHash,
        },
      ]);

      if (error) {
        console.error("Error submitting guestbook:", error);
        Swal.fire({
          title: "작성 실패",
          text: "방명록 작성에 실패했습니다. 다시 시도해주세요.",
          icon: "error",
          confirmButtonText: "확인",
          confirmButtonColor: "#f472b6",
        });
        return;
      }

      setName("");
      setMessage("");
      setPassword("");
      Swal.fire({
        title: "작성 완료",
        text: "방명록이 작성되었습니다. 감사합니다! 💕",
        icon: "success",
        confirmButtonText: "확인",
        confirmButtonColor: "#f472b6",
      });
      // Manually reload to ensure immediate update
      await loadGuestbook();
    } catch (error) {
      console.error("Error submitting guestbook:", error);
      Swal.fire({
        title: "작성 실패",
        text: "방명록 작성에 실패했습니다. 다시 시도해주세요.",
        icon: "error",
        confirmButtonText: "확인",
        confirmButtonColor: "#f472b6",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    const result = await Swal.fire({
      title: "비밀번호 입력",
      text: "삭제하려면 작성 시 입력한 비밀번호를 입력하세요:",
      input: "password",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "#f472b6",
      cancelButtonColor: "#9ca3af",
      inputValidator: (value) => {
        if (!value) {
          return "비밀번호를 입력해주세요.";
        }
        return null;
      },
    });

    if (!result.isConfirmed || !result.value) {
      return;
    }

    try {
      const { data, error } = await supabase.rpc(
        "soft_delete_guestbook_entry",
        {
          entry_id: entryId,
          entry_password: result.value,
        }
      );

      if (error) {
        console.error("Error deleting entry:", error);
        Swal.fire({
          title: "삭제 실패",
          text: "삭제에 실패했습니다.",
          icon: "error",
          confirmButtonText: "확인",
          confirmButtonColor: "#f472b6",
        });
        return;
      }

      if (data === true) {
        Swal.fire({
          title: "삭제 완료",
          text: "방명록이 삭제되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
          confirmButtonColor: "#f472b6",
        });
        // Manually reload to ensure immediate update
        await loadGuestbook();
      } else {
        Swal.fire({
          title: "비밀번호 오류",
          text: "비밀번호가 일치하지 않습니다.",
          icon: "error",
          confirmButtonText: "확인",
          confirmButtonColor: "#f472b6",
        });
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      Swal.fire({
        title: "삭제 실패",
        text: "삭제에 실패했습니다.",
        icon: "error",
        confirmButtonText: "확인",
        confirmButtonColor: "#f472b6",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  return (
    <section className="py-16 px-6 bg-rose-50">
      <div className="max-w-2xl mx-auto">
        <SectionHeader englishTitle="GUESTBOOK" koreanTitle="방명록" />

        {/* 안내 메시지 */}
        <div className="text-center mb-8 px-4">
          <p
            className="text-lg text-gray-700 leading-relaxed mb-2"
            style={{
              fontFamily:
                "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
            }}
          >
            신랑 신부의 행복한 앞날을 위해
            <br />
            <span className="text-pink-500 font-semibold">
              따뜻한 덕담 한 말씀
            </span>
            을 남겨주세요
            <br />
            소중한 추억으로 간직하겠습니다
          </p>
        </div>

        {/* Write Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-sm mb-6"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              어느 분의 하객이신가요?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="side"
                  checked={isGroom}
                  onChange={() => setIsGroom(true)}
                  className="mr-2 text-rose-500 focus:ring-rose-500"
                />
                <span className="text-gray-700">신랑측</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="side"
                  checked={!isGroom}
                  onChange={() => setIsGroom(false)}
                  className="mr-2 text-rose-500 focus:ring-rose-500"
                />
                <span className="text-gray-700">신부측</span>
              </label>
            </div>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 placeholder:text-gray-500"
            placeholder="따뜻한 축하 메시지를 전해주세요. 🥰"
            maxLength={500}
          />
          <div className="text-right text-xs text-gray-400 mt-1 mb-4">
            {message.length}/500
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="성함"
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 placeholder:text-gray-500"
              maxLength={20}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 placeholder:text-gray-500"
              maxLength={20}
            />
          </div>
          <div className="text-xs text-gray-500 mb-4">
            비밀번호는 방명록 삭제 시 필요하니 기억해주세요.
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "작성중..." : "작성하기"}
          </button>
        </form>

        {/* Guestbook Entries */}
        <div className="max-h-[600px] overflow-y-auto space-y-4 pr-2">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">불러오는 중...</div>
          ) : entries.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
              아직 작성된 방명록이 없습니다.
              <br />첫 번째 축하 메시지를 남겨주세요! 💕
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-gradient-to-br from-white via-rose-50/30 to-pink-50/40 p-8 rounded-lg shadow-md hover:shadow-lg transition-all relative border border-rose-100"
                style={{
                  fontFamily:
                    "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
                }}
              >
                {/* 편지지 장식 라인 */}
                <div className="absolute top-4 left-0 w-1 h-12 bg-gradient-to-b from-pink-300 to-rose-300 rounded-r"></div>

                {/* 날짜와 삭제 버튼 */}
                <div className="flex justify-end items-center gap-2 mb-4 text-xs text-gray-400">
                  <span>{formatDate(entry.created_at)}</span>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    title="삭제"
                  >
                    🗑️
                  </button>
                </div>

                {/* To. 신랑님/신부님 */}
                <div className="mb-6">
                  <p className="text-gray-600 text-base">
                    <span className="font-semibold text-pink-500">To.</span>{" "}
                    <span className="font-medium">
                      {entry.is_groom ? "신랑" : "신부"}
                    </span>
                  </p>
                </div>

                {/* 메시지 내용 */}
                <div className="my-6 px-2">
                  <p className="text-gray-700 whitespace-pre-wrap break-words leading-relaxed text-base">
                    {entry.message}
                  </p>
                </div>

                {/* From. 이름 */}
                <div className="mt-8 text-right">
                  <p className="text-gray-600 text-base">
                    <span className="font-semibold text-pink-500">From.</span>{" "}
                    <span className="font-medium">{entry.name}</span>
                  </p>
                </div>

                {/* 신랑측/신부측 배지 (작게 표시) */}
                <div className="absolute bottom-4 left-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      entry.is_groom
                        ? "bg-blue-100/70 text-blue-700"
                        : "bg-pink-100/70 text-pink-700"
                    }`}
                  >
                    {entry.is_groom ? "신랑측" : "신부측"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {entries.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            총 {entries.length}개의 축하 메시지
          </div>
        )}
      </div>
    </section>
  );
};
