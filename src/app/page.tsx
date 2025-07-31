import { WeddingInvitation } from "@/components/WeddingInvitation";
import { sampleWeddingData } from "@/data/sampleData";

export default function Home() {
  return (
    <main>
      <WeddingInvitation data={sampleWeddingData} />
    </main>
  );
}
