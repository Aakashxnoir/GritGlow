"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Flame,
  Trophy,
  Star,
  Target,
  Zap,
  CheckCircle2,
  Circle,
  Trash2,
  Award,
  Settings,
  UserIcon,
  Palette,
  ShoppingCart,
  Download,
  Upload,
  LogOutIcon,
  Crown,
} from "lucide-react"

interface Habit {
  id: string
  name: string
  streak: number
  totalCompleted: number
  lastCompleted: string | null
  completedToday: boolean
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  requirement: number
  type: "streak" | "total" | "habits"
}

interface HabitTrackerUser {
  id: string
  name: string
  email: string
  avatar: string
  joinDate: string
}

interface Reward {
  id: string
  name: string
  description: string
  icon: string
  cost: number
  category: "themes" | "features" | "cosmetics"
  purchased: boolean
}

interface Theme {
  id: string
  name: string
  primary: string
  secondary: string
  background: string
  unlocked: boolean
}

export default function HabitTrackerGame() {
  // Screen reader announcements state
  const [announcements, setAnnouncements] = useState<string[]>([])
  const [lastAction, setLastAction] = useState<string>("")

  // Screen reader announcement helper
  const announce = (message: string, priority: "polite" | "assertive" = "polite") => {
    setAnnouncements((prev) => [...prev.slice(-2), message]) // Keep last 3 announcements
    setLastAction(message)

    // Clear announcement after delay to prevent repetition
    setTimeout(() => {
      setLastAction("")
    }, 1000)
  }

  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabitName, setNewHabitName] = useState("")
  const [totalPoints, setTotalPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "1",
      name: "First Step",
      description: "Complete your first habit",
      icon: "🎯",
      unlocked: false,
      requirement: 1,
      type: "total",
    },
    {
      id: "2",
      name: "Streak Master",
      description: "Maintain a 7-day streak",
      icon: "🔥",
      unlocked: false,
      requirement: 7,
      type: "streak",
    },
    {
      id: "3",
      name: "Habit Builder",
      description: "Create 5 habits",
      icon: "🏗️",
      unlocked: false,
      requirement: 5,
      type: "habits",
    },
    {
      id: "4",
      name: "Consistency King",
      description: "Complete 50 habits total",
      icon: "👑",
      unlocked: false,
      requirement: 50,
      type: "total",
    },
    {
      id: "5",
      name: "Fire Keeper",
      description: "Maintain a 30-day streak",
      icon: "🌟",
      unlocked: false,
      requirement: 30,
      type: "streak",
    },
  ])

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [habitTrackerUser, setHabitTrackerUser] = useState<HabitTrackerUser | null>(null)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "" })
  const [isSignup, setIsSignup] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)
  const [currentTheme, setCurrentTheme] = useState("default")

  const [themes] = useState<Theme[]>([
    { id: "default", name: "Default", primary: "purple", secondary: "blue", background: "gradient", unlocked: true },
    { id: "ocean", name: "Ocean Breeze", primary: "cyan", secondary: "blue", background: "ocean", unlocked: false },
    { id: "sunset", name: "Sunset Glow", primary: "orange", secondary: "pink", background: "sunset", unlocked: false },
    {
      id: "forest",
      name: "Forest Green",
      primary: "green",
      secondary: "emerald",
      background: "forest",
      unlocked: false,
    },
    { id: "royal", name: "Royal Purple", primary: "violet", secondary: "purple", background: "royal", unlocked: false },
    {
      id: "minimal",
      name: "Minimal Gray",
      primary: "gray",
      secondary: "slate",
      background: "minimal",
      unlocked: false,
    },
  ])

  const [rewards] = useState<Reward[]>([
    {
      id: "1",
      name: "Ocean Theme",
      description: "Unlock the calming ocean theme",
      icon: "🌊",
      cost: 100,
      category: "themes",
      purchased: false,
    },
    {
      id: "2",
      name: "Sunset Theme",
      description: "Unlock the warm sunset theme",
      icon: "🌅",
      cost: 150,
      category: "themes",
      purchased: false,
    },
    {
      id: "3",
      name: "Premium Stats",
      description: "Unlock detailed analytics and insights",
      icon: "📊",
      cost: 200,
      category: "features",
      purchased: false,
    },
    {
      id: "4",
      name: "Custom Avatars",
      description: "Unlock custom avatar collection",
      icon: "🎭",
      cost: 75,
      category: "cosmetics",
      purchased: false,
    },
    {
      id: "5",
      name: "Sound Pack",
      description: "Unlock premium sound effects",
      icon: "🎵",
      cost: 50,
      category: "features",
      purchased: false,
    },
    {
      id: "6",
      name: "Crown Badge",
      description: "Show off your dedication with a crown",
      icon: "👑",
      cost: 300,
      category: "cosmetics",
      purchased: false,
    },
  ])

  const toggleDarkMode = () => {
    setIsThemeTransitioning(true)
    setTimeout(() => {
      setIsDarkMode(!isDarkMode)
      setTimeout(() => setIsThemeTransitioning(false), 100)
    }, 150)
  }

  const pointsToNextLevel = level * 100
  const currentLevelProgress = totalPoints % 100

  useEffect(() => {
    const savedHabits = localStorage.getItem("habits")
    const savedPoints = localStorage.getItem("totalPoints")
    const savedLevel = localStorage.getItem("level")
    const savedAchievements = localStorage.getItem("achievements")
    const savedUser = localStorage.getItem("user")
    const savedIsLoggedIn = localStorage.getItem("isLoggedIn")

    if (savedHabits) setHabits(JSON.parse(savedHabits))
    if (savedPoints) setTotalPoints(Number.parseInt(savedPoints))
    if (savedLevel) setLevel(Number.parseInt(savedLevel))
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements))
    if (savedUser) setHabitTrackerUser(JSON.parse(savedUser))
    if (savedIsLoggedIn) setIsLoggedIn(JSON.parse(savedIsLoggedIn))
  }, [])

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode")
    const savedNotifications = localStorage.getItem("notifications")
    const savedSoundEffects = localStorage.getItem("soundEffects")
    const savedTheme = localStorage.getItem("currentTheme")

    if (savedDarkMode) setIsDarkMode(JSON.parse(savedDarkMode))
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications))
    if (savedSoundEffects) setSoundEffects(JSON.parse(savedSoundEffects))
    if (savedTheme) setCurrentTheme(savedTheme)
  }, [])

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits))
    localStorage.setItem("totalPoints", totalPoints.toString())
    localStorage.setItem("level", level.toString())
    localStorage.setItem("achievements", JSON.stringify(achievements))
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode))
    localStorage.setItem("notifications", JSON.stringify(notifications))
    localStorage.setItem("soundEffects", JSON.stringify(soundEffects))
    localStorage.setItem("currentTheme", currentTheme)
    if (habitTrackerUser) localStorage.setItem("user", JSON.stringify(habitTrackerUser))
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn))
  }, [
    habits,
    totalPoints,
    level,
    achievements,
    isDarkMode,
    notifications,
    soundEffects,
    currentTheme,
    habitTrackerUser,
    isLoggedIn,
  ])

  const handleLogin = () => {
    if (loginForm.email && loginForm.password) {
      const newUser: HabitTrackerUser = {
        id: Date.now().toString(),
        name: loginForm.email.split("@")[0],
        email: loginForm.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${loginForm.email}`,
        joinDate: new Date().toISOString(),
      }
      setHabitTrackerUser(newUser)
      setIsLoggedIn(true)
      setLoginForm({ email: "", password: "" })
    }
  }

  const handleSignup = () => {
    if (signupForm.name && signupForm.email && signupForm.password) {
      const newUser: HabitTrackerUser = {
        id: Date.now().toString(),
        name: signupForm.name,
        email: signupForm.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${signupForm.email}`,
        joinDate: new Date().toISOString(),
      }
      setHabitTrackerUser(newUser)
      setIsLoggedIn(true)
      setSignupForm({ name: "", email: "", password: "" })
      setIsSignup(false)
    }
  }

  const handleLogout = () => {
    setHabitTrackerUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem("user")
    localStorage.setItem("isLoggedIn", "false")
  }

  const purchaseReward = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId)
    if (reward && totalPoints >= reward.cost && !reward.purchased) {
      setTotalPoints((prev) => prev - reward.cost)
      reward.purchased = true

      // Unlock theme if it's a theme reward
      if (reward.category === "themes") {
        const theme = themes.find((t) => t.name.toLowerCase().includes(reward.name.toLowerCase().split(" ")[0]))
        if (theme) theme.unlocked = true
      }
    }
  }

  const exportData = () => {
    const data = {
      habits,
      totalPoints,
      level,
      achievements,
      user: habitTrackerUser,
      settings: { isDarkMode, notifications, soundEffects, currentTheme },
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "habit-tracker-data.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const addHabit = () => {
    if (newHabitName.trim()) {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: newHabitName.trim(),
        streak: 0,
        totalCompleted: 0,
        lastCompleted: null,
        completedToday: false,
      }
      setHabits([...habits, newHabit])
      announce(`New habit "${newHabitName.trim()}" added successfully!`, "assertive")
      setNewHabitName("")
      checkAchievements([...habits, newHabit], totalPoints)
    }
  }

  const toggleHabit = (habitId: string) => {
    const today = new Date().toDateString()
    const habit = habits.find((h) => h.id === habitId)
    if (!habit) return

    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        if (!habit.completedToday) {
          const newStreak =
            habit.lastCompleted === new Date(Date.now() - 86400000).toDateString() ? habit.streak + 1 : 1

          setTotalPoints((prev) => {
            const newPoints = prev + 10
            if (newPoints >= level * 100) {
              setLevel((prev) => {
                const newLevel = prev + 1
                announce(`Congratulations! You've reached level ${newLevel}!`, "assertive")
                return newLevel
              })
            }
            return newPoints
          })

          announce(`${habit.name} completed! Earned 10 points. Current streak: ${newStreak} days.`, "assertive")

          return {
            ...habit,
            streak: newStreak,
            totalCompleted: habit.totalCompleted + 1,
            lastCompleted: today,
            completedToday: true,
          }
        } else {
          setTotalPoints((prev) => Math.max(0, prev - 10))
          announce(`${habit.name} marked as incomplete. Lost 10 points.`, "polite")

          return {
            ...habit,
            streak: Math.max(0, habit.streak - 1),
            totalCompleted: Math.max(0, habit.totalCompleted - 1),
            completedToday: false,
          }
        }
      }
      return habit
    })

    setHabits(updatedHabits)
    checkAchievements(
      updatedHabits,
      totalPoints + (updatedHabits.find((h) => h.id === habitId)?.completedToday ? 10 : -10),
    )
  }

  const deleteHabit = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId)
    if (habit) {
      setHabits(habits.filter((habit) => habit.id !== habitId))
      announce(`Habit "${habit.name}" deleted.`, "assertive")
    }
  }

  const checkAchievements = (currentHabits: Habit[], currentPoints: number) => {
    const maxStreak = Math.max(...currentHabits.map((h) => h.streak), 0)
    const totalCompleted = currentHabits.reduce((sum, h) => sum + h.totalCompleted, 0)
    const habitCount = currentHabits.length

    setAchievements((prev) =>
      prev.map((achievement) => {
        if (achievement.unlocked) return achievement

        let shouldUnlock = false
        switch (achievement.type) {
          case "streak":
            shouldUnlock = maxStreak >= achievement.requirement
            break
          case "total":
            shouldUnlock = totalCompleted >= achievement.requirement
            break
          case "habits":
            shouldUnlock = habitCount >= achievement.requirement
            break
        }

        if (shouldUnlock) {
          announce(`Achievement unlocked: ${achievement.name}! ${achievement.description}`, "assertive")
        }

        return { ...achievement, unlocked: shouldUnlock }
      }),
    )
  }

  const getMotivationalMessage = () => {
    const completedToday = habits.filter((h) => h.completedToday).length
    const totalHabits = habits.length

    if (totalHabits === 0) return "Add your first habit to start your journey! 🚀"
    if (completedToday === totalHabits) return "Perfect day! You're on fire! 🔥"
    if (completedToday > totalHabits / 2) return "Great progress! Keep it up! ⭐"
    if (completedToday > 0) return "Good start! Every step counts! 💪"
    return "Ready to build some habits today? 🎯"
  }

  const getThemeClasses = () => {
    const theme = themes.find((t) => t.id === currentTheme) || themes[0]
    const baseClasses = isDarkMode
      ? "bg-gradient-to-br from-gray-900 to-slate-900 text-white"
      : "bg-gradient-to-br from-purple-50 to-blue-50 text-black"

    if (currentTheme === "ocean" && theme.unlocked) {
      return isDarkMode
        ? "bg-gradient-to-br from-slate-900 to-cyan-900 text-white"
        : "bg-gradient-to-br from-cyan-50 to-blue-100 text-black"
    }
    if (currentTheme === "sunset" && theme.unlocked) {
      return isDarkMode
        ? "bg-gradient-to-br from-orange-900 to-pink-900 text-white"
        : "bg-gradient-to-br from-orange-50 to-pink-100 text-black"
    }

    return baseClasses
  }

  // Keyboard navigation handlers
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      action()
    }
  }

  const handleThemeKeyDown = (e: React.KeyboardEvent, themeId: string) => {
    if ((e.key === "Enter" || e.key === " ") && themes.find((t) => t.id === themeId)?.unlocked) {
      e.preventDefault()
      setCurrentTheme(themeId)
    }
  }

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        @keyframes focusRing {
          0% { box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.4); }
          70% { box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.1); }
          100% { box-shadow: 0 0 0 0 rgba(147, 51, 234, 0); }
        }
        
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-fade-in-scale { animation: fadeInScale 0.5s ease-out forwards; }
        .animate-slide-in-left { animation: slideInLeft 0.5s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 0.5s ease-out forwards; }
        .animate-bounce-in { animation: bounceIn 0.7s ease-out forwards; }
        .animate-pulse-gentle { animation: pulse 2s ease-in-out infinite; }
        .animate-focus-ring { animation: focusRing 0.6s ease-out; }
        
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }
        
        .theme-transition { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .card-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
        .dark .card-hover:hover { box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); }
        
        /* Enhanced Focus States */
        .focus-ring:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.5);
          border-radius: 8px;
        }
        
        .dark .focus-ring:focus-visible {
          box-shadow: 0 0 0 3px rgba(196, 181, 253, 0.6);
        }
        
        .focus-ring-inset:focus-visible {
          outline: none;
          box-shadow: inset 0 0 0 2px rgba(147, 51, 234, 0.8);
        }
        
        .dark .focus-ring-inset:focus-visible {
          box-shadow: inset 0 0 0 2px rgba(196, 181, 253, 0.8);
        }
        
        .focus-ring-button:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.6);
          transform: scale(1.02);
        }
        
        .dark .focus-ring-button:focus-visible {
          box-shadow: 0 0 0 2px rgba(196, 181, 253, 0.7);
        }
        
        .focus-ring-card:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.4), 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }
        
        .dark .focus-ring-card:focus-visible {
          box-shadow: 0 0 0 3px rgba(196, 181, 253, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        /* Skip Link */
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #000;
          color: #fff;
          padding: 8px;
          text-decoration: none;
          border-radius: 4px;
          z-index: 1000;
          transition: top 0.3s;
        }
        
        .skip-link:focus {
          top: 6px;
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .focus-ring:focus-visible {
            box-shadow: 0 0 0 3px #000;
          }
          
          .dark .focus-ring:focus-visible {
            box-shadow: 0 0 0 3px #fff;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .theme-transition,
          .card-hover,
          .animate-fade-in-up,
          .animate-fade-in-scale,
          .animate-slide-in-left,
          .animate-slide-in-right,
          .animate-bounce-in,
          .animate-pulse-gentle,
          .animate-focus-ring {
            animation: none;
            transition: none;
          }
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        .stagger-6 { animation-delay: 0.6s; }
      `}</style>

      {/* Skip to main content link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Screen Reader Announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcements.map((announcement, index) => (
          <div key={`${announcement}-${index}`}>{announcement}</div>
        ))}
      </div>
      <div className="sr-only" role="alert" aria-live="assertive" aria-atomic="true">
        {lastAction}
      </div>

      <div
        className={`min-h-screen p-4 font-mono theme-transition ${getThemeClasses()} ${isThemeTransitioning ? "opacity-90" : "opacity-100"}`}
        role="main"
        id="main-content"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <header className="text-center space-y-2 animate-fade-in-up" role="banner">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse-gentle">
                {"GlowQuest"}
              </h1>
              <nav className="flex items-center gap-2" role="navigation" aria-label="Main navigation">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-full transition-all duration-500 transform hover:scale-110 active:scale-95 focus-ring-button ${
                    isDarkMode ? "hover:bg-gray-800 rotate-180" : "hover:bg-gray-100 rotate-0"
                  }`}
                  aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
                  tabIndex={0}
                >
                  <span className="text-xl transition-transform duration-500" aria-hidden="true">
                    {isDarkMode ? "☀️" : "🌙"}
                  </span>
                </Button>

                <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 focus-ring-button ${
                        isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                      }`}
                      aria-label="Open settings"
                      tabIndex={0}
                    >
                      <Settings className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className={`max-w-4xl max-h-[80vh] overflow-y-auto focus-ring ${
                      isDarkMode ? "bg-gray-900 border-gray-700 text-white" : ""
                    }`}
                    role="dialog"
                    aria-labelledby="settings-title"
                    aria-describedby="settings-description"
                  >
                    <DialogHeader>
                      <DialogTitle
                        id="settings-title"
                        className={`flex items-center gap-2 ${isDarkMode ? "text-white" : ""}`}
                      >
                        <Settings className="h-5 w-5" aria-hidden="true" />
                        Settings
                      </DialogTitle>
                      <DialogDescription id="settings-description" className={isDarkMode ? "text-gray-400" : ""}>
                        Manage your account, preferences, and rewards
                      </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="account" className="w-full">
                      <TabsList
                        className={`grid w-full grid-cols-5 ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}
                        role="tablist"
                        aria-label="Settings sections"
                      >
                        <TabsTrigger
                          value="account"
                          className={`focus-ring-button ${
                            isDarkMode
                              ? "data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
                              : ""
                          }`}
                          role="tab"
                          aria-controls="account-panel"
                        >
                          Account
                        </TabsTrigger>
                        <TabsTrigger
                          value="appearance"
                          className={`focus-ring-button ${
                            isDarkMode
                              ? "data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
                              : ""
                          }`}
                          role="tab"
                          aria-controls="appearance-panel"
                        >
                          Theme
                        </TabsTrigger>
                        <TabsTrigger
                          value="rewards"
                          className={`focus-ring-button ${
                            isDarkMode
                              ? "data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
                              : ""
                          }`}
                          role="tab"
                          aria-controls="rewards-panel"
                        >
                          Rewards
                        </TabsTrigger>
                        <TabsTrigger
                          value="preferences"
                          className={`focus-ring-button ${
                            isDarkMode
                              ? "data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
                              : ""
                          }`}
                          role="tab"
                          aria-controls="preferences-panel"
                        >
                          Settings
                        </TabsTrigger>
                        <TabsTrigger
                          value="data"
                          className={`focus-ring-button ${
                            isDarkMode
                              ? "data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
                              : ""
                          }`}
                          role="tab"
                          aria-controls="data-panel"
                        >
                          Data
                        </TabsTrigger>
                      </TabsList>

                      {/* Account Tab */}
                      <TabsContent value="account" className="space-y-4" role="tabpanel" id="account-panel">
                        {!isLoggedIn ? (
                          <Card
                            className={`focus-ring-card ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}
                            tabIndex={0}
                          >
                            <CardHeader>
                              <CardTitle className={`flex items-center gap-2 ${isDarkMode ? "text-white" : ""}`}>
                                <UserIcon className="h-5 w-5" aria-hidden="true" />
                                {isSignup ? "Create Account" : "Sign In"}
                              </CardTitle>
                              <CardDescription className={isDarkMode ? "text-gray-400" : ""}>
                                {isSignup
                                  ? "Join Habit Quest to sync your progress"
                                  : "Sign in to save your progress across devices"}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault()
                                  isSignup ? handleSignup() : handleLogin()
                                }}
                              >
                                {isSignup && (
                                  <div className="space-y-2">
                                    <Label htmlFor="name" className={isDarkMode ? "text-gray-200" : ""}>
                                      Name
                                    </Label>
                                    <Input
                                      id="name"
                                      value={signupForm.name}
                                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                                      className={`focus-ring ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                                      required
                                      aria-describedby="name-help"
                                    />
                                    <div id="name-help" className="sr-only">
                                      Enter your full name
                                    </div>
                                  </div>
                                )}
                                <div className="space-y-2">
                                  <Label htmlFor="email" className={isDarkMode ? "text-gray-200" : ""}>
                                    Email
                                  </Label>
                                  <Input
                                    id="email"
                                    type="email"
                                    value={isSignup ? signupForm.email : loginForm.email}
                                    onChange={(e) =>
                                      isSignup
                                        ? setSignupForm({ ...signupForm, email: e.target.value })
                                        : setLoginForm({ ...loginForm, email: e.target.value })
                                    }
                                    className={`focus-ring ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                                    required
                                    aria-describedby="email-help"
                                  />
                                  <div id="email-help" className="sr-only">
                                    Enter your email address
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="password" className={isDarkMode ? "text-gray-200" : ""}>
                                    Password
                                  </Label>
                                  <Input
                                    id="password"
                                    type="password"
                                    value={isSignup ? signupForm.password : loginForm.password}
                                    onChange={(e) =>
                                      isSignup
                                        ? setSignupForm({ ...signupForm, password: e.target.value })
                                        : setLoginForm({ ...loginForm, password: e.target.value })
                                    }
                                    className={`focus-ring ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                                    required
                                    aria-describedby="password-help"
                                  />
                                  <div id="password-help" className="sr-only">
                                    Enter your password
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    type="submit"
                                    className={`flex-1 focus-ring-button ${isDarkMode ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}`}
                                  >
                                    {isSignup ? "Create Account" : "Sign In"}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsSignup(!isSignup)}
                                    className={`focus-ring-button ${isDarkMode ? "border-gray-600 text-gray-200 hover:bg-gray-700" : ""}`}
                                  >
                                    {isSignup ? "Sign In" : "Sign Up"}
                                  </Button>
                                </div>
                              </form>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card
                            className={`focus-ring-card ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}
                            tabIndex={0}
                          >
                            <CardHeader>
                              <CardTitle className={`flex items-center gap-2 ${isDarkMode ? "text-white" : ""}`}>
                                <UserIcon className="h-5 w-5" aria-hidden="true" />
                                Profile
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center gap-4">
                                <Avatar
                                  className="h-16 w-16 focus-ring"
                                  tabIndex={0}
                                  role="img"
                                  aria-label="User avatar"
                                >
                                  <AvatarImage src={habitTrackerUser?.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>{habitTrackerUser?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : ""}`}>
                                    {habitTrackerUser?.name}
                                  </h3>
                                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    {habitTrackerUser?.email}
                                  </p>
                                  <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                                    Joined {new Date(habitTrackerUser?.joinDate || "").toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <Separator className={isDarkMode ? "bg-gray-700" : ""} />
                              <div
                                className="grid grid-cols-3 gap-4 text-center"
                                role="group"
                                aria-label="User statistics"
                              >
                                <div>
                                  <p
                                    className={`text-2xl font-bold ${isDarkMode ? "text-white" : ""}`}
                                    aria-label={`Level ${level}`}
                                  >
                                    {level}
                                  </p>
                                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Level</p>
                                </div>
                                <div>
                                  <p
                                    className={`text-2xl font-bold ${isDarkMode ? "text-white" : ""}`}
                                    aria-label={`${totalPoints} points`}
                                  >
                                    {totalPoints}
                                  </p>
                                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Points</p>
                                </div>
                                <div>
                                  <p
                                    className={`text-2xl font-bold ${isDarkMode ? "text-white" : ""}`}
                                    aria-label={`${habits.length} habits`}
                                  >
                                    {habits.length}
                                  </p>
                                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Habits</p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                onClick={handleLogout}
                                className={`w-full focus-ring-button ${isDarkMode ? "border-gray-600 text-gray-200 hover:bg-gray-700" : ""}`}
                              >
                                <LogOutIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                                Sign Out
                              </Button>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>

                      {/* Appearance Tab */}
                      <TabsContent value="appearance" className="space-y-4" role="tabpanel" id="appearance-panel">
                        <Card
                          className={`focus-ring-card ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}
                          tabIndex={0}
                        >
                          <CardHeader>
                            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? "text-white" : ""}`}>
                              <Palette className="h-5 w-5" aria-hidden="true" />
                              Theme Selection
                            </CardTitle>
                            <CardDescription className={isDarkMode ? "text-gray-400" : ""}>
                              Choose your preferred theme and color scheme
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="dark-mode-switch" className={isDarkMode ? "text-gray-200" : ""}>
                                Dark Mode
                              </Label>
                              <Switch
                                id="dark-mode-switch"
                                checked={isDarkMode}
                                onCheckedChange={toggleDarkMode}
                                className={`focus-ring ${isDarkMode ? "data-[state=checked]:bg-purple-600" : ""}`}
                                aria-describedby="dark-mode-help"
                              />
                              <div id="dark-mode-help" className="sr-only">
                                Toggle between light and dark appearance
                              </div>
                            </div>
                            <Separator className={isDarkMode ? "bg-gray-700" : ""} />
                            <div className="space-y-2">
                              <Label className={isDarkMode ? "text-gray-200" : ""}>Color Theme</Label>
                              <div
                                className="grid grid-cols-2 gap-3"
                                role="radiogroup"
                                aria-label="Color theme selection"
                              >
                                {themes.map((theme) => (
                                  <div
                                    key={theme.id}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all focus-ring-card ${
                                      currentTheme === theme.id
                                        ? isDarkMode
                                          ? "border-purple-400 bg-purple-900/30 text-white"
                                          : "border-purple-500 bg-purple-50"
                                        : isDarkMode
                                          ? "border-gray-600 hover:border-gray-500 text-gray-200"
                                          : "border-gray-200 hover:border-gray-300"
                                    } ${!theme.unlocked ? "opacity-50" : ""}`}
                                    onClick={() => {
                                      if (theme.unlocked) {
                                        setCurrentTheme(theme.id)
                                        announce(`Theme changed to ${theme.name}`, "polite")
                                      } else {
                                        announce(
                                          `${theme.name} theme is locked. Purchase it from the rewards store to unlock.`,
                                          "polite",
                                        )
                                      }
                                    }}
                                    onKeyDown={(e) => handleThemeKeyDown(e, theme.id)}
                                    tabIndex={theme.unlocked ? 0 : -1}
                                    role="radio"
                                    aria-checked={currentTheme === theme.id}
                                    aria-disabled={!theme.unlocked}
                                    aria-label={`${theme.name} theme${!theme.unlocked ? " (locked)" : ""}`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className={`font-medium ${isDarkMode ? "text-white" : ""}`}>
                                        {theme.name}
                                      </span>
                                      {!theme.unlocked && (
                                        <Crown className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                                      )}
                                    </div>
                                    <div className="flex gap-1 mt-2" aria-hidden="true">
                                      <div className={`w-4 h-4 rounded-full bg-${theme.primary}-500`}></div>
                                      <div className={`w-4 h-4 rounded-full bg-${theme.secondary}-500`}></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Rewards Tab */}
                      <TabsContent value="rewards" className="space-y-4" role="tabpanel" id="rewards-panel">
                        <Card
                          className={`focus-ring-card ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}
                          tabIndex={0}
                        >
                          <CardHeader>
                            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? "text-white" : ""}`}>
                              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                              Rewards Store
                            </CardTitle>
                            <CardDescription className={isDarkMode ? "text-gray-400" : ""}>
                              Spend your points on themes, features, and cosmetics
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div
                              className="mb-4 p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white focus-ring"
                              tabIndex={0}
                              role="status"
                              aria-label={`You have ${totalPoints} points`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold">Your Points</span>
                                <span className="text-2xl font-bold">{totalPoints}</span>
                              </div>
                            </div>
                            <div className="grid gap-3" role="list" aria-label="Available rewards">
                              {rewards.map((reward) => (
                                <div
                                  key={reward.id}
                                  className={`p-4 rounded-lg border transition-all focus-ring-card ${
                                    reward.purchased
                                      ? isDarkMode
                                        ? "bg-green-900/20 border-green-700"
                                        : "bg-green-50 border-green-200"
                                      : isDarkMode
                                        ? "bg-gray-700 border-gray-600"
                                        : "bg-white border-gray-200"
                                  }`}
                                  tabIndex={0}
                                  role="listitem"
                                  aria-label={`${reward.name}: ${reward.description}. ${reward.purchased ? "Already owned" : `Costs ${reward.cost} points`}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <span className="text-2xl" aria-hidden="true">
                                        {reward.icon}
                                      </span>
                                      <div>
                                        <h4 className={`font-semibold ${isDarkMode ? "text-white" : ""}`}>
                                          {reward.name}
                                        </h4>
                                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                          {reward.description}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      {reward.purchased ? (
                                        <Badge className="bg-green-500" aria-label="Owned">
                                          Owned
                                        </Badge>
                                      ) : (
                                        <Button
                                          size="sm"
                                          disabled={totalPoints < reward.cost}
                                          onClick={() => purchaseReward(reward.id)}
                                          className={`focus-ring-button ${
                                            isDarkMode
                                              ? "bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500"
                                              : ""
                                          }`}
                                          aria-label={`Purchase ${reward.name} for ${reward.cost} points`}
                                        >
                                          {reward.cost} pts
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Preferences Tab */}
                      <TabsContent value="preferences" className="space-y-4" role="tabpanel" id="preferences-panel">
                        <Card
                          className={`focus-ring-card ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}
                          tabIndex={0}
                        >
                          <CardHeader>
                            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? "text-white" : ""}`}>
                              <Settings className="h-5 w-5" aria-hidden="true" />
                              Preferences
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <Label htmlFor="notifications-switch" className={isDarkMode ? "text-gray-200" : ""}>
                                  Notifications
                                </Label>
                                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  Get reminders for your habits
                                </p>
                              </div>
                              <Switch
                                id="notifications-switch"
                                checked={notifications}
                                onCheckedChange={setNotifications}
                                className={`focus-ring ${isDarkMode ? "data-[state=checked]:bg-purple-600" : ""}`}
                                aria-describedby="notifications-help"
                              />
                              <div id="notifications-help" className="sr-only">
                                Enable or disable habit reminder notifications
                              </div>
                            </div>
                            <Separator className={isDarkMode ? "bg-gray-700" : ""} />
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <Label htmlFor="sound-effects-switch" className={isDarkMode ? "text-gray-200" : ""}>
                                  Sound Effects
                                </Label>
                                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  Play sounds for interactions
                                </p>
                              </div>
                              <Switch
                                id="sound-effects-switch"
                                checked={soundEffects}
                                onCheckedChange={setSoundEffects}
                                className={`focus-ring ${isDarkMode ? "data-[state=checked]:bg-purple-600" : ""}`}
                                aria-describedby="sound-effects-help"
                              />
                              <div id="sound-effects-help" className="sr-only">
                                Enable or disable sound effects for app interactions
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Data Tab */}
                      <TabsContent value="data" className="space-y-4" role="tabpanel" id="data-panel">
                        <Card
                          className={`focus-ring-card ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}
                          tabIndex={0}
                        >
                          <CardHeader>
                            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? "text-white" : ""}`}>
                              <Download className="h-5 w-5" aria-hidden="true" />
                              Data Management
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Button
                              onClick={exportData}
                              variant="outline"
                              className={`w-full focus-ring-button ${isDarkMode ? "border-gray-600 text-gray-200 hover:bg-gray-700" : ""}`}
                              aria-describedby="export-help"
                            >
                              <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                              Export Data
                            </Button>
                            <div id="export-help" className="sr-only">
                              Download all your habit data as a JSON file
                            </div>
                            <Button
                              variant="outline"
                              className={`w-full focus-ring-button ${isDarkMode ? "border-gray-600 text-gray-200 hover:bg-gray-700" : ""}`}
                              aria-describedby="import-help"
                            >
                              <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
                              Import Data
                            </Button>
                            <div id="import-help" className="sr-only">
                              Upload a previously exported data file
                            </div>
                            <Separator className={isDarkMode ? "bg-gray-700" : ""} />
                            <div
                              className={`p-3 rounded-lg ${
                                isDarkMode ? "bg-red-900/30 border border-red-700" : "bg-red-50 border border-red-200"
                              }`}
                              role="region"
                              aria-labelledby="danger-zone-title"
                            >
                              <h4
                                id="danger-zone-title"
                                className={`font-semibold mb-2 ${isDarkMode ? "text-red-400" : "text-red-800"}`}
                              >
                                Danger Zone
                              </h4>
                              <Button
                                variant="destructive"
                                size="sm"
                                className={`focus-ring-button ${isDarkMode ? "bg-red-600 hover:bg-red-700" : ""}`}
                                aria-describedby="reset-help"
                              >
                                Reset All Data
                              </Button>
                              <div id="reset-help" className="sr-only">
                                Warning: This will permanently delete all your habit data
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </nav>
            </div>
            <p
              className={`theme-transition animate-fade-in-up stagger-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              role="status"
              aria-live="polite"
              aria-label="Daily motivation message"
            >
              {getMotivationalMessage()}
            </p>
          </header>

          {/* Stats Dashboard */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Statistics dashboard">
            <Card
              className={`theme-transition card-hover animate-fade-in-scale stagger-1 focus-ring-card ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}
              tabIndex={0}
              role="region"
              aria-labelledby="level-title"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle
                  id="level-title"
                  className={`text-sm font-medium theme-transition ${isDarkMode ? "text-gray-200" : ""}`}
                >
                  Level
                </CardTitle>
                <Zap className="h-4 w-4 text-yellow-500 animate-pulse-gentle" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div
                  className="text-2xl font-bold animate-bounce-in"
                  aria-label={`Current level: ${level}. Progress to next level: ${currentLevelProgress} out of 100 experience points.`}
                >
                  {level}
                </div>
                <Progress
                  value={currentLevelProgress}
                  className="mt-2 theme-transition"
                  aria-label="Level progress"
                  aria-describedby="level-progress-text"
                />
                <p id="level-progress-text" className="text-xs text-muted-foreground mt-1 theme-transition">
                  {currentLevelProgress}/100 XP to next level
                </p>
              </CardContent>
            </Card>

            <Card
              className={`theme-transition card-hover animate-fade-in-scale stagger-2 focus-ring-card ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}
              tabIndex={0}
              role="region"
              aria-labelledby="points-title"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle
                  id="points-title"
                  className={`text-sm font-medium theme-transition ${isDarkMode ? "text-gray-200" : ""}`}
                >
                  Total Points
                </CardTitle>
                <Star className="h-4 w-4 text-purple-500 animate-pulse-gentle" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div
                  className="text-2xl font-bold animate-bounce-in"
                  aria-label={`Total points earned: ${totalPoints}`}
                >
                  {totalPoints}
                </div>
                <p className="text-xs text-muted-foreground theme-transition">+10 points per habit completed</p>
              </CardContent>
            </Card>

            <Card
              className={`theme-transition card-hover animate-fade-in-scale stagger-3 focus-ring-card ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}
              tabIndex={0}
              role="region"
              aria-labelledby="streak-title"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle
                  id="streak-title"
                  className={`text-sm font-medium theme-transition ${isDarkMode ? "text-gray-200" : ""}`}
                >
                  Best Streak
                </CardTitle>
                <Flame className="h-4 w-4 text-orange-500 animate-pulse-gentle" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div
                  className="text-2xl font-bold animate-bounce-in"
                  aria-label={`Best streak: ${Math.max(...habits.map((h) => h.streak), 0)} days`}
                >
                  {Math.max(...habits.map((h) => h.streak), 0)}
                </div>
                <p className="text-xs text-muted-foreground theme-transition">Keep the momentum going!</p>
              </CardContent>
            </Card>
          </section>

          {/* Add New Habit */}
          <section
            className={`theme-transition card-hover animate-slide-in-left stagger-2`}
            aria-labelledby="add-habit-title"
          >
            <Card className={`focus-ring-card ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`} tabIndex={0}>
              <CardHeader>
                <CardTitle
                  id="add-habit-title"
                  className={`flex items-center gap-2 theme-transition ${isDarkMode ? "text-gray-200" : ""}`}
                >
                  <Target className="h-5 w-5 animate-pulse-gentle" aria-hidden="true" />
                  Add New Habit
                </CardTitle>
                <CardDescription className={`theme-transition ${isDarkMode ? "text-gray-400" : ""}`}>
                  Start building a new positive habit today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (!newHabitName.trim()) {
                      announce("Please enter a habit name before adding.", "assertive")
                      return
                    }
                    addHabit()
                  }}
                  className="flex gap-2"
                  role="form"
                  aria-labelledby="add-habit-title"
                >
                  <Input
                    placeholder="e.g., Drink 8 glasses of water"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    className={`theme-transition transition-all duration-300 focus:scale-105 focus-ring ${
                      isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : ""
                    }`}
                    aria-label="New habit name"
                    aria-describedby="habit-input-help habit-input-instructions"
                    aria-required="true"
                    aria-invalid={newHabitName.trim() === "" ? "true" : "false"}
                  />
                  <div id="habit-input-help" className="sr-only">
                    Enter the name of a new habit you want to track daily
                  </div>
                  <div id="habit-input-instructions" className="sr-only">
                    Type a habit name and press Enter or click the plus button to add it to your list
                  </div>
                  <Button
                    type="submit"
                    className="transition-all duration-300 hover:scale-105 active:scale-95 focus-ring-button"
                    aria-label="Add new habit to your tracking list"
                    disabled={!newHabitName.trim()}
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Add habit</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>

          {/* Habits List */}
          <section className="grid gap-4" aria-label="Your habits">
            {habits.map((habit, index) => (
              <Card
                key={habit.id}
                className={`theme-transition card-hover animate-slide-in-right transition-all duration-300 focus-ring-card ${
                  habit.completedToday
                    ? isDarkMode
                      ? "bg-green-900/50 border-green-700 shimmer"
                      : "bg-green-50 border-green-200 shimmer"
                    : isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                tabIndex={0}
                role="article"
                aria-labelledby={`habit-${habit.id}-name`}
                aria-describedby={`habit-${habit.id}-stats habit-${habit.id}-status`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleHabit(habit.id)}
                        onKeyDown={(e) => handleKeyDown(e, () => toggleHabit(habit.id))}
                        className={`p-0 h-8 w-8 transition-all duration-300 hover:scale-110 active:scale-95 focus-ring-button ${
                          habit.completedToday ? "text-green-600" : "text-gray-400"
                        }`}
                        aria-label={`${habit.completedToday ? "Mark as incomplete" : "Mark as complete"}: ${habit.name}`}
                        aria-pressed={habit.completedToday}
                        aria-describedby={`habit-${habit.id}-completion-help`}
                      >
                        {habit.completedToday ? (
                          <CheckCircle2 className="h-6 w-6 animate-bounce-in" aria-hidden="true" />
                        ) : (
                          <Circle className="h-6 w-6" aria-hidden="true" />
                        )}
                      </Button>
                      <div id={`habit-${habit.id}-completion-help`} className="sr-only">
                        {habit.completedToday
                          ? "This habit is completed for today. Click to mark as incomplete."
                          : "This habit is not completed today. Click to mark as complete and earn 10 points."}
                      </div>
                      <div>
                        <h3
                          id={`habit-${habit.id}-name`}
                          className={`font-medium theme-transition transition-all duration-300 ${
                            habit.completedToday
                              ? isDarkMode
                                ? "line-through text-green-400"
                                : "line-through text-green-700"
                              : isDarkMode
                                ? "text-gray-200"
                                : ""
                          }`}
                        >
                          {habit.name}
                        </h3>
                        <div
                          id={`habit-${habit.id}-stats`}
                          className={`flex items-center gap-4 text-sm theme-transition ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          <span className="flex items-center gap-1 transition-all duration-300 hover:scale-105">
                            <Flame className="h-3 w-3" aria-hidden="true" />
                            <span aria-label={`Current streak: ${habit.streak} days`}>{habit.streak} day streak</span>
                          </span>
                          <span className="flex items-center gap-1 transition-all duration-300 hover:scale-105">
                            <Trophy className="h-3 w-3" aria-hidden="true" />
                            <span aria-label={`Total completions: ${habit.totalCompleted}`}>
                              {habit.totalCompleted} completed
                            </span>
                          </span>
                        </div>
                        <div id={`habit-${habit.id}-status`} className="sr-only">
                          {habit.completedToday
                            ? `${habit.name} is completed for today. You earned 10 points.`
                            : `${habit.name} is not completed today.`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {habit.completedToday && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700 animate-bounce-in transition-all duration-300 hover:scale-105"
                          aria-label="10 experience points earned for completing this habit"
                        >
                          +10 XP
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete the habit "${habit.name}"?`)) {
                            deleteHabit(habit.id)
                          }
                        }}
                        className="text-red-500 hover:text-red-700 transition-all duration-300 hover:scale-110 active:scale-95 focus-ring-button"
                        aria-label={`Delete habit: ${habit.name}. This action cannot be undone.`}
                        aria-describedby={`habit-${habit.id}-delete-help`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <div id={`habit-${habit.id}-delete-help`} className="sr-only">
                        Permanently remove this habit from your tracking list. You will be asked to confirm this action.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Achievements */}
          <section
            className={`theme-transition card-hover animate-fade-in-up stagger-4`}
            aria-labelledby="achievements-title"
          >
            <Card className={`focus-ring-card ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`} tabIndex={0}>
              <CardHeader>
                <CardTitle
                  id="achievements-title"
                  className={`flex items-center gap-2 theme-transition ${isDarkMode ? "text-gray-200" : ""}`}
                >
                  <Award className="h-5 w-5 animate-pulse-gentle" aria-hidden="true" />
                  Achievements
                </CardTitle>
                <CardDescription className={`theme-transition ${isDarkMode ? "text-gray-400" : ""}`}>
                  Unlock badges as you build your habits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  role="list"
                  aria-label="Achievement badges"
                >
                  {achievements.map((achievement, index) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border theme-transition card-hover animate-fade-in-scale transition-all duration-300 focus-ring-card ${
                        achievement.unlocked
                          ? isDarkMode
                            ? "bg-yellow-900/30 border-yellow-700 shimmer"
                            : "bg-yellow-50 border-yellow-200 shimmer"
                          : isDarkMode
                            ? "bg-gray-700 border-gray-600 opacity-60"
                            : "bg-gray-50 border-gray-200 opacity-60"
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      tabIndex={0}
                      role="listitem"
                      aria-label={`${achievement.name}: ${achievement.description}. ${achievement.unlocked ? "Unlocked" : "Locked"}`}
                    >
                      <div className="text-center space-y-2">
                        <div
                          className={`text-2xl transition-all duration-300 ${achievement.unlocked ? "animate-bounce-in" : ""}`}
                          aria-hidden="true"
                        >
                          {achievement.icon}
                        </div>
                        <h4 className="font-medium theme-transition">{achievement.name}</h4>
                        <p className="text-xs text-gray-600 theme-transition">{achievement.description}</p>
                        {achievement.unlocked && (
                          <Badge className="bg-yellow-500 text-white animate-bounce-in transition-all duration-300 hover:scale-105">
                            Unlocked!
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {habits.length === 0 && (
            <section
              className={`text-center py-12 theme-transition card-hover animate-fade-in-up stagger-5`}
              aria-label="Empty state"
            >
              <Card className={`focus-ring-card ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`} tabIndex={0}>
                <CardContent>
                  <Target className="h-12 w-12 mx-auto text-gray-400 mb-4 animate-pulse-gentle" aria-hidden="true" />
                  <h3 className={`text-lg font-medium mb-2 theme-transition ${isDarkMode ? "text-gray-200" : ""}`}>
                    No habits yet
                  </h3>
                  <p className={`mb-4 theme-transition ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Start your journey by adding your first habit above
                  </p>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </div>
    </>
  )
}
