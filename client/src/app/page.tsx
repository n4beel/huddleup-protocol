import AppLayout from "./components/common/AppLayout";
import CTA from "./components/common/CTA";
import LatestEvents from "./components/Events/LatestEvents";
import PastEvents from "./components/Events/PastEvents";

export default function Home() {
  return (
    <AppLayout>
      <main className="w-full min-h-screen relative overflow-hidden p-4">
        <LatestEvents />
        <CTA />
        <br/>
        <PastEvents />
      </main>
    </AppLayout>
  );
}
