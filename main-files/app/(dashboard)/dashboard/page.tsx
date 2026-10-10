import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { RecentFiles } from "@/components/dashboard/recent-files";
import { RecentUsers } from "@/components/dashboard/recent-users";

import { MessageSquare, Zap, FolderKanban, Sparkles } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Chats" value="1,284" change={12.5} icon={MessageSquare} />
        <StatsCard
          title="Credits Used"
          value="2,450 / 5,000"
          change={-4.2}
          icon={Zap}
          iconColor="text-orange-600 bg-orange-500/10"
        />
        <StatsCard
          title="Active Projects"
          value="8"
          change={2.1}
          icon={FolderKanban}
          iconColor="text-blue-600 bg-blue-500/10"
        />
        <StatsCard
          title="Images Generated"
          value="342"
          change={18.4}
          icon={Sparkles}
          iconColor="text-purple-600 bg-purple-500/10"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <UsageChart />
          <RevenueChart />
        </div>
        <div className="flex flex-col gap-4">
          <AnalyticsCard />
          <RecentUsers />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ActivityFeed />
        <RecentFiles />
      </div>
    </div>
  );
}