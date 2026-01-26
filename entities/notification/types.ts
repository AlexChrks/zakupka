export interface NotificationCounts {
  newOffers: number
  newRfqs: number
  newWins: number
}

export interface UserNotificationState {
  id: string
  userId: string
  lastOffersSeenAt: string
  lastRfqsSeenAt: string
  createdAt: string
  updatedAt: string
}

export interface UserNotificationStateRow {
  id: string
  user_id: string
  last_offers_seen_at: string
  last_rfqs_seen_at: string
  created_at: string
  updated_at: string
}

export function notificationStateFromRow(row: UserNotificationStateRow): UserNotificationState {
  return {
    id: row.id,
    userId: row.user_id,
    lastOffersSeenAt: row.last_offers_seen_at,
    lastRfqsSeenAt: row.last_rfqs_seen_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
