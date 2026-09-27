import { Wallpaper } from "@/components/Wallpaper";
import { DynamicIsland } from "@/components/DynamicIsland";
import { LockScreen } from "@/components/LockScreen";
import { HomeScreen } from "@/components/HomeScreen";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Achievements } from "@/components/Achievements";
import { ControlCenter } from "@/components/ControlCenter";
import { Messages } from "@/components/Messages";
import { QuickControls, Spotlight } from "@/components/Spotlight";
import { profile } from "@/data/profile";
import { HelloIntro } from "@/components/HelloIntro";

export default function Home() {
  return (
    <>
      <Wallpaper />
      <DynamicIsland />
      <main>
        <LockScreen />
        <HomeScreen />
        <Projects />
        <Experience />
        <Achievements />
        <ControlCenter />
        <Messages />
      </main>
      <footer className="pb-24 text-center text-[13px] text-fg-3">
        © {new Date().getFullYear()} {profile.name} · Designed & built with care in {profile.location.split(",")[0]}
      </footer>
      <Spotlight />
      <QuickControls />
      <HelloIntro />
    </>
  );
}
