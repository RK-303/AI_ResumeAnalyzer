"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, X, Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResumeData } from "@/types";
import { cn } from "@/lib/utils";

const resumeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required").or(z.literal("")),
  phone: z.string(),
  summary: z.string(),
  skillsRaw: z.string(), // comma-separated
});

type ResumeFormValues = z.infer<typeof resumeSchema>;

interface ResumeEditorProps {
  data: ResumeData;
  onSave: (updated: ResumeData) => void;
  className?: string;
}

function EditableSection({
  title,
  children,
  onEdit,
  editing,
  onSave,
  onCancel,
}: {
  title: string;
  children: React.ReactNode;
  onEdit: () => void;
  editing: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">
            {title}
          </CardTitle>
          {!editing ? (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit} aria-label={`Edit ${title}`}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-400" onClick={onSave} aria-label="Save">
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={onCancel} aria-label="Cancel">
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function ResumeEditor({ data, onSave, className }: ResumeEditorProps) {
  const [localData, setLocalData] = useState<ResumeData>(data);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      summary: data.summary,
      skillsRaw: data.skills.join(", "),
    },
  });

  // ── Basic info section ──
  const handleBasicSave = handleSubmit((values) => {
    const updated: ResumeData = {
      ...localData,
      name: values.name,
      email: values.email,
      phone: values.phone,
      summary: values.summary,
      skills: values.skillsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    setLocalData(updated);
    onSave(updated);
    setEditingSection(null);
  });

  const handleBasicCancel = () => {
    reset({
      name: localData.name,
      email: localData.email,
      phone: localData.phone,
      summary: localData.summary,
      skillsRaw: localData.skills.join(", "),
    });
    setEditingSection(null);
  };

  // ── Experience bullet edit ──
  const updateExperienceBullet = (expIdx: number, bulletIdx: number, value: string) => {
    const updated = { ...localData };
    updated.experience = updated.experience.map((exp, i) => {
      if (i !== expIdx) return exp;
      const bullets = [...exp.bullets];
      bullets[bulletIdx] = value;
      return { ...exp, bullets };
    });
    setLocalData(updated);
  };

  const addExperienceBullet = (expIdx: number) => {
    const updated = { ...localData };
    updated.experience = updated.experience.map((exp, i) => {
      if (i !== expIdx) return exp;
      return { ...exp, bullets: [...exp.bullets, ""] };
    });
    setLocalData(updated);
  };

  const removeExperienceBullet = (expIdx: number, bulletIdx: number) => {
    const updated = { ...localData };
    updated.experience = updated.experience.map((exp, i) => {
      if (i !== expIdx) return exp;
      return { ...exp, bullets: exp.bullets.filter((_, j) => j !== bulletIdx) };
    });
    setLocalData(updated);
  };

  const saveExperience = () => {
    onSave(localData);
    setEditingSection(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Basic Info */}
      <EditableSection
        title="Basic Information"
        editing={editingSection === "basic"}
        onEdit={() => setEditingSection("basic")}
        onSave={handleBasicSave}
        onCancel={handleBasicCancel}
      >
        {editingSection === "basic" ? (
          <form className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" {...register("summary")} rows={3} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Textarea id="skills" {...register("skillsRaw")} rows={2} />
            </div>
          </form>
        ) : (
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-foreground">{localData.name}</p>
            <p className="text-muted-foreground">{localData.email} · {localData.phone}</p>
            {localData.summary && (
              <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                {localData.summary}
              </p>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {localData.skills.slice(0, 8).map((skill, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {localData.skills.length > 8 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  +{localData.skills.length - 8} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </EditableSection>

      {/* Experience */}
      <EditableSection
        title="Experience"
        editing={editingSection === "experience"}
        onEdit={() => setEditingSection("experience")}
        onSave={saveExperience}
        onCancel={() => setEditingSection(null)}
      >
        <div className="space-y-4">
          {localData.experience.map((exp, expIdx) => (
            <div key={expIdx} className="space-y-2">
              <div>
                <p className="text-sm font-semibold text-foreground">{exp.title}</p>
                <p className="text-xs text-muted-foreground">
                  {exp.company} · {exp.duration}
                </p>
              </div>
              {editingSection === "experience" ? (
                <div className="space-y-1.5 ml-2">
                  {exp.bullets.map((bullet, bulletIdx) => (
                    <div key={bulletIdx} className="flex gap-2">
                      <Input
                        value={bullet}
                        onChange={(e) =>
                          updateExperienceBullet(expIdx, bulletIdx, e.target.value)
                        }
                        className="text-xs h-8"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                        onClick={() => removeExperienceBullet(expIdx, bulletIdx)}
                        aria-label="Remove bullet"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 text-primary"
                    onClick={() => addExperienceBullet(expIdx)}
                  >
                    <Plus className="h-3 w-3" />
                    Add bullet
                  </Button>
                </div>
              ) : (
                <ul className="list-disc list-inside space-y-0.5 text-xs text-muted-foreground ml-2">
                  {exp.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </EditableSection>
    </div>
  );
}
