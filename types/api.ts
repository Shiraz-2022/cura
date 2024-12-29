export interface ThreadType {
  id: number;
  Name: string;
  comment: string;
  upvotes: string;
  time: string;
  subThreads: ThreadType[];
}

export interface ChatType {
  id: number;
  sender: string;
  message: string;
  timestamp: string;
  isReceived: boolean;
}

export type ChatbotType = {
  id: number;
  prompt: string;
  reply: string;
  timestamp: Date;
};
