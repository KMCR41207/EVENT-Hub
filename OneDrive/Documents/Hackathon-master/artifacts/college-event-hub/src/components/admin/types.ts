export type EventStatus = "upcoming" | "ongoing" | "completed";
export type EventCategory = "Hackathon" | "Club" | "Traditional";

export type ClubEvent = {
  id: string;
  title: string;
  date: string;
  description: string;
  category: EventCategory;
  status: EventStatus;
  image: string;
};
