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
          <div id="invitation">
            <InvitationSection
              message={data.invitationMessage}
              groom={data.groom}
              bride={data.bride}
            />
          </div>
        </AnimatedSection>

        {/* 웨딩 정보 - 날짜, 시간, 장소 */}
        <AnimatedSection delay={0.2}>
          <div id="info">
            <InfoSection ceremony={data.ceremony} />
          </div>
        </AnimatedSection>

        {/* 연락처 */}
        <AnimatedSection delay={0.2}>
          <div id="contact">
            <ContactSection groom={data.groom} bride={data.bride} />
          </div>
        </AnimatedSection>

        {/* 카운트다운 타이머 */}
        <AnimatedSection delay={0.1}>
          <div id="countdown">
            <CountdownTimer
              targetDate={data.ceremony.date}
              groomName={data.groom.name}
              brideName={data.bride.name}
              ceremony={data.ceremony}
            />
          </div>
        </AnimatedSection>

        {/* 갤러리 */}
        <AnimatedSection delay={0.2}>
          <div id="gallery">
            <GallerySection images={data.gallery} />
          </div>
        </AnimatedSection>

        {/* 오시는 길 */}
        <AnimatedSection delay={0.2}>
          <div id="location">
            <LocationSection ceremony={data.ceremony} />
          </div>
        </AnimatedSection>

        {/* 포토부스 이용안내 */}
        <AnimatedSection delay={0.2}>
          <div id="photobooth">
            <PhotoBoothSection />
          </div>
        </AnimatedSection>

        {/* 방명록 */}
        <AnimatedSection delay={0.2}>
          <div id="guestbook">
            <GuestbookSection />
          </div>
        </AnimatedSection>

        {/* 계좌 정보 */}
        <AnimatedSection delay={0.2}>
          <div id="account">
            <AccountSection
              groomAccounts={data.groomAccounts}
              brideAccounts={data.brideAccounts}
              groomName={data.groom.name}
              brideName={data.bride.name}
            />
          </div>
        </AnimatedSection>

        {/* 푸터 */}
        <AnimatedSection delay={0.2}>
          <div id="footer">
            <FooterSection />
          </div>
        </AnimatedSection>
      </div>

      {/* Sticky 음악 플레이어 */}
      <StickyMusicPlayer backgroundMusic={data.backgroundMusic} />
    </>
  );
};
