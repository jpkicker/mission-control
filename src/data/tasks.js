// Mission Control Tasks Data
// This file is updated by Milo to track all tasks

export const tasks = [
  // DONE
  {
    id: 1,
    title: "Set up Telegram integration",
    description: "Connected Telegram for chat communication",
    project: "Clawdbot",
    status: "done",
    date: "Jan 29",
    completedThisWeek: false
  },
  {
    id: 2,
    title: "Configure Gmail & Calendar",
    description: "Set up gog CLI for Google Workspace access",
    project: "Clawdbot",
    status: "done",
    date: "Jan 29",
    completedThisWeek: false
  },
  {
    id: 3,
    title: "Set up Quote Log workflow",
    description: "Created system for flooring quotes with sf/carton",
    project: "Shaw",
    status: "done",
    date: "Jan 31",
    completedThisWeek: true
  },
  {
    id: 4,
    title: "Quote: Eric @ Floors Direct",
    description: "VV735-04026 Irene Walnut - $3.73/sf",
    project: "Shaw",
    status: "done",
    date: "Jan 31",
    completedThisWeek: true
  },
  {
    id: 5,
    title: "Quote: Joey @ Southland Floors",
    description: "3080V Dwell - $2.29/sf (4 pallets)",
    project: "Shaw",
    status: "done",
    date: "Jan 31",
    completedThisWeek: true
  },
  {
    id: 6,
    title: "Update USER.md profile",
    description: "Added family, golf, Bitcoin, communication preferences",
    project: "Personal",
    status: "done",
    date: "Feb 1",
    completedThisWeek: true
  },
  {
    id: 7,
    title: "Clone Wolves website repo",
    description: "Set up GitHub access for website updates",
    project: "Wolves",
    status: "done",
    date: "Feb 1",
    completedThisWeek: true
  },
  {
    id: 8,
    title: "Configure memory & session settings",
    description: "Enabled memoryFlush and sessionMemory",
    project: "Clawdbot",
    status: "done",
    date: "Feb 1",
    completedThisWeek: true
  },
  {
    id: 9,
    title: "Set up Sonnet for sub-agents",
    description: "Configured cheaper model for background tasks",
    project: "Clawdbot",
    status: "done",
    date: "Feb 1",
    completedThisWeek: true
  },
  {
    id: 10,
    title: "Create Bitcoin news cron job",
    description: "Twice-daily filtered BTC news checks",
    project: "Bitcoin",
    status: "done",
    date: "Feb 1",
    completedThisWeek: true
  },
  {
    id: 11,
    title: "Build Mission Control dashboard",
    description: "Kanban board + activity feed for task tracking",
    project: "Clawdbot",
    status: "done",
    date: "Feb 1",
    completedThisWeek: true
  },
  {
    id: 16,
    title: "Create Wolves flight options CSV",
    description: "Flight routes, times, airlines for all tournaments in Google Drive",
    project: "Wolves",
    status: "done",
    date: "Feb 1",
    completedThisWeek: true
  },
  {
    id: 17,
    title: "Fix OTR tournament names",
    description: "Updated Sweet 16 in ATL (May) and Power 24 in Cartersville (July)",
    project: "Wolves",
    status: "done",
    date: "Feb 1",
    completedThisWeek: true
  },
  {
    id: 18,
    title: "Add calendar view to schedule",
    description: "Toggle between list and calendar view on Wolves website",
    project: "Wolves",
    status: "done",
    date: "Feb 1",
    completedThisWeek: true
  },
  {
    id: 19,
    title: "Add clickable modal to calendar",
    description: "Events now open detail popup like list view accordion",
    project: "Wolves",
    status: "done",
    date: "Feb 1",
    completedThisWeek: true
  },
  {
    id: 20,
    title: "Update March Madness venue",
    description: "Set venue to Village Park in Wellington",
    project: "Wolves",
    status: "done",
    date: "Feb 1",
    completedThisWeek: true
  },
  {
    id: 21,
    title: "Add full venue addresses",
    description: "Village Park, Wiregrass Ranch, Big House - full addresses in both views",
    project: "Wolves",
    status: "done",
    date: "Feb 1",
    completedThisWeek: true
  },
  
  // WISHLIST
  {
    id: 12,
    title: "Add players to Wolves roster",
    description: "Fill in TBD roster slots as players are confirmed",
    project: "Wolves",
    status: "wishlist",
    date: null
  },
  {
    id: 13,
    title: "Email monitoring & alerts",
    description: "Set up important email notifications",
    project: "Clawdbot",
    status: "wishlist",
    date: null
  },
  {
    id: 14,
    title: "Calendar reminders",
    description: "Proactive alerts for upcoming events",
    project: "Clawdbot",
    status: "wishlist",
    date: null
  },
  {
    id: 15,
    title: "BTC price dip alerts",
    description: "Notify when Bitcoin drops 5-10% in a day",
    project: "Bitcoin",
    status: "wishlist",
    date: null
  }
];

export const activity = [
  {
    type: "completed",
    action: "added",
    task: "Full Venue Addresses (Village Park, Wiregrass, Big House)",
    time: "Just now"
  },
  {
    type: "completed",
    action: "added",
    task: "Clickable Modal to Calendar View",
    time: "5 minutes ago"
  },
  {
    type: "completed",
    action: "updated",
    task: "March Madness Venue → Village Park",
    time: "2 minutes ago"
  },
  {
    type: "completed",
    action: "added",
    task: "Calendar View to Wolves Schedule",
    time: "5 minutes ago"
  },
  {
    type: "completed",
    action: "fixed",
    task: "OTR Tournament Names (Sweet 16 & Power 24)",
    time: "10 minutes ago"
  },
  {
    type: "completed",
    action: "created",
    task: "Flight Options CSV in Google Drive",
    time: "15 minutes ago"
  },
  {
    type: "completed",
    action: "completed",
    task: "Mission Control Dashboard",
    time: "30 minutes ago"
  },
  {
    type: "completed",
    action: "completed",
    task: "Bitcoin News Cron Job",
    time: "1 hour ago"
  },
  {
    type: "completed",
    action: "configured",
    task: "Sonnet for Sub-agents",
    time: "1 hour ago"
  },
  {
    type: "completed",
    action: "set up",
    task: "Wolves Website Repo",
    time: "2 hours ago"
  }
];
