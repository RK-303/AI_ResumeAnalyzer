"use client";

import React from "react";
import {
  Mail,
  Phone,
  Link as LinkIcon,
  Briefcase,
  GraduationCap,
  Code2,
  Award,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ResumeData } from "@/types";
import { cn } from "@/lib/utils";

interface ResumePreviewProps {
  data: ResumeData;
  className?: string;
}

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-4 w-4 text-primary" />
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        {title}
      </h3>
    </div>
  );
}

export function ResumePreview({ data, className }: ResumePreviewProps) {
  return (
    <div className={cn("space-y-6 text-sm", className)}>
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">{data.name || "—"}</h2>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-xs">
          {data.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              {data.email}
            </span>
          )}
          {data.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {data.phone}
            </span>
          )}
          {data.links?.map((link, i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              {link.replace(/^https?:\/\//, "")}
            </a>
          ))}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <>
          <Separator />
          <div>
            <p className="text-muted-foreground leading-relaxed">{data.summary}</p>
          </div>
        </>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <>
          <Separator />
          <div>
            <SectionHeader icon={Code2} title="Skills" />
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <>
          <Separator />
          <div>
            <SectionHeader icon={Briefcase} title="Experience" />
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground">{exp.title}</p>
                      <p className="text-muted-foreground text-xs">{exp.company}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {exp.duration}
                    </span>
                  </div>
                  {exp.bullets?.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs ml-1">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="leading-relaxed">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <>
          <Separator />
          <div>
            <SectionHeader icon={GraduationCap} title="Education" />
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div key={i} className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">
                      {edu.degree} in {edu.field}
                    </p>
                    <p className="text-muted-foreground text-xs">{edu.institution}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {edu.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <>
          <Separator />
          <div>
            <SectionHeader icon={Code2} title="Projects" />
            <div className="space-y-3">
              {data.projects.map((project, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{project.name}</p>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`View ${project.name}`}
                      >
                        <LinkIcon className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack?.map((tech, j) => (
                      <Badge key={j} variant="secondary" className="text-xs px-1.5 py-0">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Certifications */}
      {data.certifications?.length > 0 && (
        <>
          <Separator />
          <div>
            <SectionHeader icon={Award} title="Certifications" />
            <ul className="space-y-1">
              {data.certifications.map((cert, i) => (
                <li key={i} className="text-muted-foreground text-xs flex items-center gap-1.5">
                  <Award className="h-3 w-3 text-amber-400 shrink-0" />
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Achievements */}
      {data.achievements?.length > 0 && (
        <>
          <Separator />
          <div>
            <SectionHeader icon={Trophy} title="Achievements" />
            <ul className="space-y-1">
              {data.achievements.map((ach, i) => (
                <li key={i} className="text-muted-foreground text-xs flex items-center gap-1.5">
                  <Trophy className="h-3 w-3 text-amber-400 shrink-0" />
                  {ach}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
