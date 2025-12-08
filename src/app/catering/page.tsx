"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Coffee,
  Calendar,
  Mail,
  Phone,
  CheckCircle2,
  Cake,
  Briefcase,
  Heart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Image from "next/image";

const CateringPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  const services = [
    {
      icon: Briefcase,
      title: "Corporate Events",
      description:
        "Impress clients and energize your team with our premium Hawaiian coffee bar service",
    },
    {
      icon: Heart,
      title: "Weddings",
      description:
        "Add a touch of aloha to your special day with our authentic island coffee experience",
    },
    {
      icon: Cake,
      title: "Private Parties",
      description:
        "From birthdays to celebrations, bring the coffee truck experience to your event",
    },
    {
      icon: Users,
      title: "Community Events",
      description:
        "Serving festivals, farmers markets, and community gatherings with mobile aloha",
    },
  ];

  const packages = [
    {
      name: "Essential",
      price: "Starting at $500",
      features: [
        "Get our mobile coffee truck on-site",
        "Dedicated barista team",
        "Basic setup and cleanup",
        "Customers pay out of pocket",
        "Minimum guarantee of 100 paying customers",
      ],
    },
    {
      name: "Premium",
      price: "Starting at $1000",
      features: [
        "Mobile coffee truck on-site",
        "Up to 100 servings included",
        "5 signature drink options",
        "4-hour service window",
        "Custom branded signage",
        "Dedicated barista team",
      ],
      popular: true,
    },
    {
      name: "Deluxe",
      price: "Custom Quote",
      features: [
        "Mobile coffee truck on-site",
        "Unlimited servings",
        "Full menu access",
        "Premium pastries & food options",
        "Full-day service",
        "Custom branded cups",
        "Dedicated barista team",
      ],
    },
  ];

  const process = [
    {
      step: "1",
      title: "Contact Us",
      description: "Fill out our inquiry form or call us directly",
    },
    {
      step: "2",
      title: "Plan Together",
      description: "We'll work with you to customize the perfect menu",
    },
    {
      step: "3",
      title: "Confirm Details",
      description: "Finalize date, time, location, and guest count",
    },
    {
      step: "4",
      title: "Enjoy!",
      description: "We handle everything while you enjoy your event",
    },
  ];

  return (
    <div className="pt-20 min-h-screen bg-kona-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-kona-brown/10 to-kona-teal/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text side */}
            <motion.div
