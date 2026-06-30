import {
  Plane, PlaneTakeoff, PlaneLanding, Globe2, MapPin, Clock, Calendar, Users,
  User, Check, CheckCheck, X, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  ArrowRight, ArrowUpRight, ArrowLeft, ArrowUpCircle, ArrowDownCircle, TrendingUp,
  Gauge, Gift, ShieldCheck, CreditCard, Coins, Filter, Download, Search, Menu,
  Zap, Timer, BadgeCheck, CircleCheck, Plus, Minus, Info, Lock, RefreshCw, Repeat,
  BarChart3, Ticket, Tag, Trophy, Gem, Crown, Star, Sparkles, ConciergeBell,
  Armchair, Luggage, Wifi, Coffee, Leaf, Rocket, BedDouble, Car, UtensilsCrossed,
  Headphones, Wallet, Plane as PlaneIcon, Award, Target, Layers, Compass, Send,
  CircleDollarSign, Percent, ChartNoAxesColumn, type LucideProps,
} from "lucide-react";

const REGISTRY: Record<string, React.ComponentType<LucideProps>> = {
  Plane, PlaneTakeoff, PlaneLanding, Globe2, MapPin, Clock, Calendar, Users,
  User, Check, CheckCheck, X, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  ArrowRight, ArrowUpRight, ArrowLeft, ArrowUpCircle, ArrowDownCircle, TrendingUp,
  Gauge, Gift, ShieldCheck, CreditCard, Coins, Filter, Download, Search, Menu,
  Zap, Timer, BadgeCheck, CircleCheck, Plus, Minus, Info, Lock, RefreshCw, Repeat,
  BarChart3, Ticket, Tag, Trophy, Gem, Crown, Star, Sparkles, ConciergeBell,
  Armchair, Luggage, Wifi, Coffee, Leaf, Rocket, BedDouble, Car, UtensilsCrossed,
  Headphones, Wallet, PlaneIcon, Award, Target, Layers, Compass, Send,
  CircleDollarSign, Percent, ChartNoAxesColumn,
};

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = REGISTRY[name] ?? Sparkles;
  return <Cmp {...props} />;
}
