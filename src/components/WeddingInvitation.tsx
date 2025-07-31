"use client";

import { WeddingData } from "@/types";
import { AnimatedSection } from "./ui/AnimatedSection";
import { StickyMusicPlayer } from "./ui/StickyMusicPlayer";
import { CountdownTimer } from "./ui/CountdownTimer";
import { HeaderSection } from "./sections/HeaderSection";
import { InvitationSection } from "./sections/InvitationSection";
import { ContactSection } from "./sections/ContactSection";
import { GallerySection } from "./sections/GallerySection";
import { InfoSection } from "./sections/InfoSection";
import { LocationSection } from "./sections/LocationSection";
import { PhotoBoothSection } from "./sections/PhotoBoothSection";
import { GuestbookSection } from "./sections/GuestbookSection";
import { AccountSection } from "./sections/AccountSection";
import { FooterSection } from "./sections/FooterSection";

interface WeddingInvitationProps {
  data: WeddingData;
}

export const WeddingInvitation = ({ data }: WeddingInvitationProps) => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50">
        {/* 헤더 - 이름, 날짜 */}
        <HeaderSection
          groom={data.groom}
          bride={data.bride}
          ceremony={data.ceremony}
        />

        {/* 초대 메시지 */}
        <AnimatedSection delay={0.2}>
          <InvitationSection
            message={data.invitationMessage}
            groom={data.groom}
            bride={data.bride}
          />
        </AnimatedSection>

        {/* 연락처 */}
        <AnimatedSection delay={0.2}>
          <ContactSection groom={data.groom} bride={data.bride} />
        </AnimatedSection>

        {/* 카운트다운 타이머 */}
        <AnimatedSection delay={0.1}>
          <CountdownTimer
            targetDate={data.ceremony.date}
            groomName={data.groom.name}
            brideName={data.bride.name}
            ceremony={data.ceremony}
          />
        </AnimatedSection>

        {/* 갤러리 */}
        <AnimatedSection delay={0.2}>
          <GallerySection images={data.gallery} />
        </AnimatedSection>

        {/* 웨딩 정보 - 날짜, 시간, 장소 */}
        <AnimatedSection delay={0.2}>
          <InfoSection ceremony={data.ceremony} />
        </AnimatedSection>

        {/* 오시는 길 */}
        <AnimatedSection delay={0.2}>
          <LocationSection ceremony={data.ceremony} />
        </AnimatedSection>

        {/* 포토부스 이용안내 */}
        <AnimatedSection delay={0.2}>
          <PhotoBoothSection />
        </AnimatedSection>

        {/* 방명록 */}
        <AnimatedSection delay={0.2}>
          <GuestbookSection />
        </AnimatedSection>

        {/* 계좌 정보 */}
        <AnimatedSection delay={0.2}>
          <AccountSection
            groomAccounts={data.groomAccounts}
            brideAccounts={data.brideAccounts}
            groomName={data.groom.name}
            brideName={data.bride.name}
          />
        </AnimatedSection>

        {/* 푸터 */}
        <AnimatedSection delay={0.2}>
          <FooterSection />
        </AnimatedSection>
      </div>

      {/* Sticky 음악 플레이어 */}
      <StickyMusicPlayer backgroundMusic={data.backgroundMusic} />
    </>
  );
};
