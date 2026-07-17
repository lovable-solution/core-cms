import type { LucideIcon } from 'lucide-react';
import {
  Cpu, Target, Handshake, Globe, FileText, Mail, MapPin, Brain, TrendingUp, ShieldCheck,
  Sparkles, GraduationCap, Briefcase, HardDrive, Blocks, ArrowUpRight, Radar, Wind, ArrowRight,
  Activity, Award, Calendar, Package, LineChart, Check, Circle, Zap, HandCoins, SlidersHorizontal,
  Puzzle, ClipboardCheck, ScrollText, Shield, Users, Gauge, Building,
  Star, Heart, Info, AlertCircle, AlertTriangle, HelpCircle, Settings, Bell, BarChart, BarChart2,
  PieChart, TrendingDown, DollarSign, CreditCard, ShoppingCart, ShoppingBag, Truck, Boxes, Database,
  Server, Cloud, CloudUpload, CloudDownload, Wifi, Signal, Lock, Unlock, Key, Eye, EyeOff,
  UserCheck, UserPlus, Users2, Building2, Factory, Layers, Grid, List, LayoutGrid, LayoutDashboard,
  Compass, Map, Navigation, Flag, Anchor, Ship, Plane, Train, Car, Rocket, Battery, Timer, Clock,
  CalendarCheck, CalendarClock, FileCheck, Folder, FolderOpen, Paperclip, Link, ExternalLink, Download,
  Upload, RefreshCw, RotateCw, CheckCircle, CheckCircle2, XCircle, PlusCircle, MinusCircle, Filter,
  Bookmark, Tag, Tags, Trophy, Medal, ThumbsUp, MessageSquare, MessageCircle, Phone, PhoneCall,
  Video, Mic, Headphones, Wrench, Hammer, Cog, ShieldAlert, Fingerprint, Scan, QrCode, Globe2,
  Navigation2, Sunrise, Sunset, Droplet, Flame, Snowflake, Leaf, TreePine, Mountain, Waves,
  Monitor, ClipboardList, FileBarChart, FileSpreadsheet, BadgeCheck, BadgeAlert,
  Route, Signpost, TrafficCone, HardHat, Siren, Ambulance, Stethoscope, Microscope, FlaskConical,
  Recycle, Sprout,
} from 'lucide-react';

export const ICON_REGISTRY: Record<string, LucideIcon> = {
  Cpu, Target, Handshake, Globe, FileText, Mail, MapPin, Brain, TrendingUp, ShieldCheck,
  Sparkles, GraduationCap, Briefcase, HardDrive, Blocks, ArrowUpRight, Radar, Wind, ArrowRight,
  Activity, Award, Calendar, Package, LineChart, Check, Circle, Zap, HandCoins, SlidersHorizontal,
  Puzzle, ClipboardCheck, ScrollText, Shield, Users, Gauge, Building,
  Star, Heart, Info, AlertCircle, AlertTriangle, HelpCircle, Settings, Bell, BarChart, BarChart2,
  PieChart, TrendingDown, DollarSign, CreditCard, ShoppingCart, ShoppingBag, Truck, Boxes, Database,
  Server, Cloud, CloudUpload, CloudDownload, Wifi, Signal, Lock, Unlock, Key, Eye, EyeOff,
  UserCheck, UserPlus, Users2, Building2, Factory, Layers, Grid, List, LayoutGrid, LayoutDashboard,
  Compass, Map, Navigation, Flag, Anchor, Ship, Plane, Train, Car, Rocket, Battery, Timer, Clock,
  CalendarCheck, CalendarClock, FileCheck, Folder, FolderOpen, Paperclip, Link, ExternalLink, Download,
  Upload, RefreshCw, RotateCw, CheckCircle, CheckCircle2, XCircle, PlusCircle, MinusCircle, Filter,
  Bookmark, Tag, Tags, Trophy, Medal, ThumbsUp, MessageSquare, MessageCircle, Phone, PhoneCall,
  Video, Mic, Headphones, Wrench, Hammer, Cog, ShieldAlert, Fingerprint, Scan, QrCode, Globe2,
  Navigation2, Sunrise, Sunset, Droplet, Flame, Snowflake, Leaf, TreePine, Mountain, Waves,
  Monitor, ClipboardList, FileBarChart, FileSpreadsheet, BadgeCheck, BadgeAlert,
  Route, Signpost, TrafficCone, HardHat, Siren, Ambulance, Stethoscope, Microscope, FlaskConical,
  Recycle, Sprout,
};

export const ICON_CATEGORIES: { label: string; icons: string[] }[] = [
  { label: 'Business & Growth', icons: ['TrendingUp', 'TrendingDown', 'BarChart', 'BarChart2', 'PieChart', 'DollarSign', 'CreditCard', 'Briefcase', 'Building', 'Building2', 'Factory', 'Handshake', 'Award', 'Trophy', 'Medal', 'Target'] },
  { label: 'Technology & Systems', icons: ['Cpu', 'HardDrive', 'Database', 'Server', 'Cloud', 'CloudUpload', 'CloudDownload', 'Wifi', 'Signal', 'Monitor', 'Layers', 'Blocks', 'RefreshCw', 'RotateCw', 'QrCode', 'Scan'] },
  { label: 'Safety & Compliance', icons: ['Shield', 'ShieldCheck', 'ShieldAlert', 'HardHat', 'Siren', 'AlertCircle', 'AlertTriangle', 'TrafficCone', 'Lock', 'Unlock', 'Key', 'Fingerprint', 'BadgeCheck', 'BadgeAlert', 'CheckCircle', 'CheckCircle2'] },
  { label: 'Operations & Docs', icons: ['ClipboardCheck', 'ClipboardList', 'FileText', 'FileCheck', 'FileBarChart', 'FileSpreadsheet', 'ScrollText', 'Folder', 'FolderOpen', 'Paperclip', 'Package', 'Boxes', 'Truck', 'Route', 'Signpost'] },
  { label: 'People & Training', icons: ['Users', 'Users2', 'UserCheck', 'UserPlus', 'GraduationCap', 'Sparkles', 'Activity', 'Stethoscope', 'Microscope', 'FlaskConical'] },
  { label: 'Communication', icons: ['Mail', 'MessageSquare', 'MessageCircle', 'Phone', 'PhoneCall', 'Video', 'Mic', 'Headphones', 'Send', 'Bell'] },
  { label: 'Navigation & Map', icons: ['Globe', 'Globe2', 'MapPin', 'Map', 'Compass', 'Navigation', 'Navigation2', 'Flag', 'Anchor', 'Ship', 'Plane', 'Train', 'Car', 'Rocket'] },
  { label: 'Environment', icons: ['Wind', 'Droplet', 'Flame', 'Snowflake', 'Leaf', 'TreePine', 'Mountain', 'Waves', 'Recycle', 'Sprout', 'Sunrise', 'Sunset'] },
  { label: 'Interface', icons: ['Star', 'Heart', 'Info', 'HelpCircle', 'Settings', 'Cog', 'Eye', 'EyeOff', 'Grid', 'List', 'LayoutGrid', 'LayoutDashboard', 'Filter', 'Bookmark', 'Tag', 'Tags', 'ThumbsUp', 'PlusCircle', 'MinusCircle', 'XCircle', 'ExternalLink', 'Link', 'Download', 'Upload', 'Timer', 'Clock', 'Calendar', 'CalendarCheck', 'CalendarClock', 'Battery', 'Gauge', 'Wrench', 'Hammer', 'ArrowRight', 'ArrowUpRight', 'Circle', 'Check', 'Zap', 'HandCoins', 'SlidersHorizontal', 'Puzzle', 'ShoppingCart', 'ShoppingBag', 'Radar'] },
];

export function resolveIcon(name?: string | null): LucideIcon | null {
  if (!name) return null;
  return ICON_REGISTRY[name] ?? null;
}
