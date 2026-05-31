"use client";

import Nav from "@/app/components/layout/Nav";
import AISummary from "@/app/components/dashboard/AISummary";
import EmailsCard from "@/app/components/dashboard/EmailsCard";
import MeetingsCard from "@/app/components/dashboard/MeetingsCard";
import TasksCard from "@/app/components/dashboard/TasksCard";
import PRsCard from "@/app/components/dashboard/PRsCard";
import ChatInput from "@/app/components/dashboard/ChatInput";
import SqlDrawer from "@/app/components/dashboard/SqlDrawer";

export default function DashboardPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <AISummary />
            <ChatInput />
            <SqlDrawer />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <EmailsCard />
            <MeetingsCard />
            <TasksCard />
            <PRsCard />
          </div>
        </div>
      </main>
    </>
  );
}
