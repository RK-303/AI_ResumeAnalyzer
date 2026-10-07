import React from "react";
import {
  Brain,
  Shield,
  Target,
  Zap,
  BookOpen,
  FileEdit,
  Map,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Resume Analysis",
    description:
      "Deep analysis of your resume content, structure, and language using advanced AI models.",
    gradient: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-400",
  },
  {
    icon: Shield,
    title: "ATS Compatibility",
    description:
      "Check if your resume can pass Applicant Tracking Systems with a detailed compatibility report.",
    gradient: "from-green-500/20 to-green-600/10",
    iconColor: "text-green-400",
  },
  {
    icon: Target,
    title: "Job Match Score",
    description:
      "See exactly how well your resume matches a specific job description with a percentage score.",
    gradient: "from-orange-500/20 to-orange-600/10",
    iconColor: "text-orange-400",
  },
  {
    icon: Zap,
    title: "Skill Gap Detection",
    description:
      "Identify missing skills for your target role and understand their importance to employers.",
    gradient: "from-yellow-500/20 to-yellow-600/10",
    iconColor: "text-yellow-400",
  },
  {
    icon: BookOpen,
    title: "Resource Recommendations",
    description:
      "Curated courses, tutorials, and certifications to close each identified skill gap.",
    gradient: "from-purple-500/20 to-purple-600/10",
    iconColor: "text-purple-400",
  },
  {
    icon: FileEdit,
    title: "AI Resume Improvement",
    description:
      "Get specific, section-by-section suggestions to strengthen your resume content.",
    gradient: "from-pink-500/20 to-pink-600/10",
    iconColor: "text-pink-400",
  },
  {
    icon: Map,
    title: "Career Roadmap",
    description:
      "A personalized step-by-step plan covering what to learn, build, and add to your resume.",
    gradient: "from-cyan-500/20 to-cyan-600/10",
    iconColor: "text-cyan-400",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Track your resume score improvement over time and stay motivated with visible progress.",
    gradient: "from-indigo-500/20 to-indigo-600/10",
    iconColor: "text-indigo-400",
  },
];

export function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Land the Job
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A complete career intelligence platform — not just a resume checker.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-xl border border-border bg-card p-5 overflow-hidden hover:border-primary/40 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Gradient background accent */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative">
                  {/* Icon */}
                  <div className="h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center mb-4 group-hover:border-primary/30 transition-colors">
                    <Icon className={`h-5 w-5 ${feature.iconColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
