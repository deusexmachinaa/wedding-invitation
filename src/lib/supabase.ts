import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase 환경 변수가 설정되지 않았습니다!");
  console.log("💡 .env.local 파일에 다음 변수를 추가하세요:");
  console.log("   NEXT_PUBLIC_SUPABASE_URL=your-project-url");
  console.log("   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key");
  throw new Error(
    "Missing Supabase environment variables. Please check .env.local file."
  );
}

console.log("✅ Supabase client initialized");
console.log("🔗 Project URL:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
