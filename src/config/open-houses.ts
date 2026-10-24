export type OpenHouse = {
  slug: string; address: string; startsAt: string; endsAt: string;
  listingUrl: string; approved: boolean; verifiedAt: string;
  checkInUrl?: string; signingUrl?: string;
};
// Add only agent-confirmed events and brokerage-approved destinations.
// Empty is intentional: no historical or demonstration event is advertised.
export const OPEN_HOUSES: readonly OpenHouse[] = [];
export function upcomingOpenHouses(now = new Date(), events = OPEN_HOUSES) {
  return events.filter(e => e.approved && Number.isFinite(Date.parse(e.startsAt)) &&
    Date.parse(e.endsAt) > Date.parse(e.startsAt) && Date.parse(e.endsAt) > now.getTime() &&
    /^https:\/\//.test(e.listingUrl) && Number.isFinite(Date.parse(e.verifiedAt)))
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
}
