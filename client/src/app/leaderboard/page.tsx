import React from "react";
import AppLayout from "../components/common/AppLayout";

const LeaderBoard = () => {
  const topThree = [
    { rank: 1, name: "Alice Johnson", points: 1250, avatar: "/assets/user.png" },
    { rank: 2, name: "Michael Smith", points: 980, avatar: "/assets/user.png" },
    { rank: 3, name: "Sara Lee", points: 910, avatar: "/assets/user.png" },
  ];

  const others = [
    { rank: 4, name: "David Brown", points: 860 },
    { rank: 5, name: "Emily Davis", points: 830 },
    { rank: 6, name: "Chris Wilson", points: 790 },
    { rank: 7, name: "Sophia Miller", points: 760 },
    { rank: 8, name: "James Taylor", points: 740 },
  ];

  return (
    <AppLayout>
      <main className="w-full min-h-screen relative overflow-hidden px-4 py-8">
        {/* Top 3 Podium */}
        <div className="flex justify-center items-end gap-4 lg:gap-8 mb-8">
          {/* 2nd */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-success border-4 border-success overflow-hidden">
              <img src={topThree[1].avatar} alt={topThree[1].name} />
            </div>
            <p className="text-base font-semibold mt-2 text-black">
              {topThree[1].name}
            </p>
            <p className="text-sm text-foreground">{topThree[1].points} pts</p>
            <div className="bg-success w-10 h-12 mt-2 rounded-t-md"></div>
          </div>

          {/* 1st */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-primary border-4 border-primary overflow-hidden">
              <img src={topThree[0].avatar} alt={topThree[0].name} />
            </div>
            <p className="text-base font-semibold mt-2 text-black">
              {topThree[0].name}
            </p>
            <p className="text-sm text-foreground">{topThree[0].points} pts</p>
            <div className="bg-primary w-12 h-16 mt-2 rounded-t-md"></div>
          </div>

          {/* 3rd */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-secondary border-4 border-secondary overflow-hidden">
              <img src={topThree[2].avatar} alt={topThree[2].name} />
            </div>
            <p className="text-base font-semibold mt-2 text-black">
              {topThree[0].name}
            </p>
            <p className="text-sm text-foreground">{topThree[0].points} pts</p>
            <div className="bg-secondary w-10 h-10 mt-2 rounded-t-md"></div>
          </div>
        </div>

        {/* Others */}
        <div className="w-full p-4 flex flex-col gap-2">
          {others.map((user) => (
            <div
              key={user.rank}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-none"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-black font-semibold">
                  {user.rank}
                </span>
                <span className="text-base font-medium text-black">{user.name}</span>
              </div>
              <span className="text-foreground text-base font-semibold">
                {user.points} pts
              </span>
            </div>
          ))}
        </div>

      </main>
    </AppLayout>
  );
};

export default LeaderBoard;
