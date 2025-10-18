import AppLayout from "./components/common/AppLayout";
import LatestEvents from "./components/Events/LatestEvents";

export default function Home() {
  return (
    <AppLayout>
      <main className="w-full min-h-screen relative overflow-hidden p-4">
        <LatestEvents />
      </main>
    </AppLayout>
  );
}
