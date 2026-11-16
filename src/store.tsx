import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';
export type Priority = 'Low' | 'Medium' | 'High';
export type BookingStatus = 'Active' | 'Parked' | 'Cancelled' | 'Completed' | 'Expired';

export type Complaint = {
  id: string; category: string; description: string; area: string; location: string; createdAt: string;
  upvotes: number; status: ComplaintStatus; voice?: { text: string; language: string; audioUrl?: string };
  ward: string; officer: string; escalationLevel: number; autoEscalated?: boolean;
};
export type Parking = { id: string; name: string; location: string; total: number; available: number; };
export type Booking = { id: string; parkingId: string; parking: string; slot: string; vehicleNumber: string; vehicleType: string; createdAt: string; expiresAt: number; status: BookingStatus; };
export type Station = { id: string; name: string; location: string; total: number; available: number; cost: number; distance: string; waiting: number; };
export type Bus = { id: string; route: string; from: string; to: string; position: number; eta: number; reports: number; subscribed: boolean; };
export type User = { id: string; name: string; mobile: string; area: string; ward: string; role: 'Citizen' | 'Admin'; status: 'Active' | 'Review'; };

type Store = {
  complaints: Complaint[]; parking: Parking[]; bookings: Booking[]; stations: Station[]; buses: Bus[]; users: User[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'upvotes' | 'status' | 'escalationLevel'>) => { duplicate: boolean; complaint: Complaint };
  upvote: (id: string) => void; updateComplaint: (id: string, change: Partial<Complaint>) => void;
  book: (parkingId: string, vehicleNumber: string, vehicleType: string) => Booking | null; updateBooking: (id: string, status: BookingStatus) => void;
  plugIn: (id: string) => void; unplug: (id: string) => void; reportDelay: (id: string) => void; reset: () => void;
};

const initialComplaints: Complaint[] = [
  { id: 'CMP-1001', category: 'Pothole', description: 'Deep pothole near the bus stand causing traffic slowdowns.', area: 'Erode North', location: '11.3410, 77.7172', createdAt: '2026-11-14T10:20:00', upvotes: 11, status: 'In Progress', voice: undefined, ward: '14', officer: 'R. Selvaraj', escalationLevel: 0 },
  { id: 'CMP-1002', category: 'Garbage', description: 'Waste collection missed for two days on Gandhi Street.', area: 'Erode Central', location: '11.3402, 77.7280', createdAt: '2026-11-15T08:10:00', upvotes: 5, status: 'Pending', ward: '12', officer: 'Unassigned', escalationLevel: 0 },
  { id: 'CMP-1003', category: 'Streetlight', description: 'Streetlight is not working near the school entrance.', area: 'Perundurai Road', location: '11.2815, 77.5904', createdAt: '2026-11-10T18:00:00', upvotes: 2, status: 'Resolved', ward: '16', officer: 'S. Meenakshi', escalationLevel: 0 },
];
const initialParking: Parking[] = [{ id: 'p1', name: 'Erode Central Parking', location: 'Erode Bus Stand', total: 50, available: 12 }, { id: 'p2', name: 'Gandhi Road Smart Park', location: 'Gandhi Road', total: 36, available: 8 }, { id: 'p3', name: 'Railway Station Parking', location: 'Erode Junction', total: 80, available: 31 }];
const initialStations: Station[] = [{ id: 's1', name: 'Green Energy Charging Station', location: 'Erode Central', total: 6, available: 2, cost: 18, distance: '2.5 km', waiting: 0 }, { id: 's2', name: 'Perundurai Highway Hub', location: 'Perundurai Road', total: 8, available: 0, cost: 16, distance: '5.8 km', waiting: 3 }, { id: 's3', name: 'Solaris Mobility Point', location: 'Railway Station', total: 4, available: 4, cost: 20, distance: '7.1 km', waiting: 0 }];
const initialBuses: Bus[] = [{ id: 'b1', route: 'Route 1', from: 'Erode', to: 'Perundurai', position: 58, eta: 12, reports: 0, subscribed: true }, { id: 'b2', route: 'Route 2', from: 'Erode', to: 'Bhavani', position: 34, eta: 18, reports: 2, subscribed: true }, { id: 'b3', route: 'Route 3', from: 'Erode', to: 'Sathyamangalam', position: 76, eta: 25, reports: 0, subscribed: false }];
const initialUsers: User[] = [{ id: 'U001', name: 'Arjun Kumar', mobile: '9876543210', area: 'Erode', ward: '12', role: 'Citizen', status: 'Active' }, { id: 'U002', name: 'Priya Devi', mobile: '9786501234', area: 'Perundurai', ward: '14', role: 'Citizen', status: 'Active' }, { id: 'U003', name: 'Kumaravel', mobile: '9876512345', area: 'Erode', ward: '16', role: 'Admin', status: 'Active' }, { id: 'U004', name: 'Meena Raj', mobile: '9654321098', area: 'Bhavani', ward: '18', role: 'Citizen', status: 'Review' }];

const safeLoad = <T,>(key: string, fallback: T): T => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } };
const makeId = (prefix: string) => `${prefix}-${Math.floor(1000 + Math.random() * 8999)}`;
const priority = (votes: number): Priority => votes >= 10 ? 'High' : votes >= 4 ? 'Medium' : 'Low';

const StoreContext = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>(() => safeLoad('smart-city-complaints', initialComplaints));
  const [parking, setParking] = useState<Parking[]>(() => safeLoad('smart-city-parking', initialParking));
  const [bookings, setBookings] = useState<Booking[]>(() => safeLoad('smart-city-bookings', []));
  const [stations, setStations] = useState<Station[]>(() => safeLoad('smart-city-stations', initialStations));
  const [buses, setBuses] = useState<Bus[]>(() => safeLoad('smart-city-buses', initialBuses));
  const [users, setUsers] = useState<User[]>(() => safeLoad('smart-city-users', initialUsers));
  useEffect(() => { try { localStorage.setItem('smart-city-complaints', JSON.stringify(complaints)); localStorage.setItem('smart-city-parking', JSON.stringify(parking)); localStorage.setItem('smart-city-bookings', JSON.stringify(bookings)); localStorage.setItem('smart-city-stations', JSON.stringify(stations)); localStorage.setItem('smart-city-buses', JSON.stringify(buses)); localStorage.setItem('smart-city-users', JSON.stringify(users)); } catch { /* local-only mode can continue without storage */ } }, [complaints, parking, bookings, stations, buses, users]);
  useEffect(() => { const timer = window.setInterval(() => setBuses(items => items.map(bus => ({ ...bus, position: bus.position >= 96 ? 4 : bus.position + 1, eta: bus.eta <= 1 ? 20 : bus.eta - 1 / 5 })) ), 3000); return () => window.clearInterval(timer); }, []);
  useEffect(() => { const timer = window.setInterval(() => { const now = Date.now(); setBookings(items => items.map(booking => booking.status === 'Active' && booking.expiresAt <= now ? { ...booking, status: 'Expired' } : booking)); }, 1000); return () => window.clearInterval(timer); }, []);
  const actions = useMemo<Store>(() => ({
    complaints, parking, bookings, stations, buses, users,
    addComplaint: (input) => {
      const duplicate = complaints.find(item => item.status !== 'Resolved' && ((item.category === input.category && item.area === input.area) || item.location === input.location));
      if (duplicate) { setComplaints(items => items.map(item => item.id === duplicate.id ? { ...item, upvotes: item.upvotes + 1 } : item)); return { duplicate: true, complaint: { ...duplicate, upvotes: duplicate.upvotes + 1 } }; }
      const complaint: Complaint = { ...input, id: makeId('CMP'), createdAt: new Date().toISOString(), upvotes: 1, status: 'Pending', escalationLevel: 0 };
      setComplaints(items => [complaint, ...items]); return { duplicate: false, complaint };
    },
    upvote: (id) => setComplaints(items => items.map(item => item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item)),
    updateComplaint: (id, change) => setComplaints(items => items.map(item => item.id === id ? { ...item, ...change } : item)),
    book: (parkingId, vehicleNumber, vehicleType) => { const lot = parking.find(item => item.id === parkingId); if (!lot || lot.available <= 0) return null; const booking: Booking = { id: makeId('PKG'), parkingId, parking: lot.name, slot: `A-${lot.total - lot.available + 1}`, vehicleNumber, vehicleType, createdAt: new Date().toISOString(), expiresAt: Date.now() + 15 * 60 * 1000, status: 'Active' }; setParking(items => items.map(item => item.id === parkingId ? { ...item, available: Math.max(0, item.available - 1) } : item)); setBookings(items => [booking, ...items]); return booking; },
    updateBooking: (id, status) => setBookings(items => items.map(item => item.id === id ? { ...item, status } : item).map(item => item)),
    plugIn: (id) => setStations(items => items.map(item => item.id === id && item.available > 0 ? { ...item, available: item.available - 1 } : item)),
    unplug: (id) => setStations(items => items.map(item => item.id === id ? { ...item, available: Math.min(item.total, item.available + 1), waiting: Math.max(0, item.waiting - 1) } : item)),
    reportDelay: (id) => setBuses(items => items.map(item => item.id === id ? { ...item, reports: item.reports + 1 } : item)),
    reset: () => { setComplaints(initialComplaints); setParking(initialParking); setBookings([]); setStations(initialStations); setBuses(initialBuses); setUsers(initialUsers); },
  }), [complaints, parking, bookings, stations, buses, users]);
  return <StoreContext.Provider value={actions}>{children}</StoreContext.Provider>;
}
export const useStore = () => { const value = useContext(StoreContext); if (!value) throw new Error('StoreProvider is missing'); return value; };
export { priority };
