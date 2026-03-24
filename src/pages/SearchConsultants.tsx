import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Clock, Star, Filter, X, Sliders } from "lucide-react";
import { CircularNavbar } from "@/components/layout/CircularNavbar";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ConsultantSearchForm } from "@/components/forms/ConsultantSearchForm";
import { useDataStore, Consultant } from "@/store/dataStore";

export default function SearchConsultants() {
  const consultants = useDataStore((state) => state.consultants);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [maxRate, setMaxRate] = useState("");
  const [availability, setAvailability] = useState("");

  // Get all unique skills
  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    consultants.forEach((c) => c.skills.forEach((s) => skills.add(s)));
    return Array.from(skills).sort();
  }, [consultants]);

  // Filter consultants
  const filteredConsultants = useMemo(() => {
    return consultants.filter((consultant) => {
      // Search query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        consultant.firstName.toLowerCase().includes(searchLower) ||
        consultant.lastName.toLowerCase().includes(searchLower) ||
        consultant.title.toLowerCase().includes(searchLower) ||
        consultant.skills.some((s) => s.toLowerCase().includes(searchLower)) ||
        consultant.location.toLowerCase().includes(searchLower);

      // Skills filter
      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.every((skill) => consultant.skills.includes(skill));

      // Rate filter
      const matchesRate = !maxRate || consultant.rate <= parseInt(maxRate);

      // Availability filter
      const matchesAvailability =
        !availability ||
        consultant.availability.toLowerCase().includes(availability.toLowerCase());

      return matchesSearch && matchesSkills && matchesRate && matchesAvailability;
    });
  }, [consultants, searchQuery, selectedSkills, maxRate, availability]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSkills([]);
    setMaxRate("");
    setAvailability("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="particles-bg" />
      <CircularNavbar />
      <main className="pt-32 pb-24">
        <div className="container px-6">
          {/* Advanced Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-12"
          >
            <div className="w-full">
              <ConsultantSearchForm
                onSearch={(filters) => {
                  console.log("Advanced search:", filters);
                  // Apply filters to search logic here
                }}
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-8">
            {/* Results */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  <span className="text-foreground font-semibold">
                    {filteredConsultants.length}
                  </span>{" "}
                  consultants found
                </p>
                {selectedSkills.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-primary/20 text-primary"
                      >
                        {skill}
                        <button onClick={() => toggleSkill(skill)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {filteredConsultants.map((consultant, index) => (
                  <ConsultantCard
                    key={consultant.id}
                    consultant={consultant}
                    index={index}
                  />
                ))}

                {filteredConsultants.length === 0 && (
                  <GlassCard className="text-center py-12">
                    <p className="text-muted-foreground">
                      No consultants found matching your criteria.
                    </p>
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="mt-4"
                    >
                      Clear filters
                    </Button>
                  </GlassCard>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ConsultantCard({
  consultant,
  index,
}: {
  consultant: Consultant;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <GlassCard className="hover:border-primary/30 transition-all" hover={false}>
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-2xl font-bold text-primary flex-shrink-0">
            {consultant.firstName[0]}
            {consultant.lastName[0]}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
              <h3 className="text-xl font-semibold text-foreground">
                {consultant.firstName} {consultant.lastName}
              </h3>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">4.9</span>
              </div>
            </div>

            <p className="text-primary font-medium mb-3">{consultant.title}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {consultant.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {consultant.availability}
              </span>
              <span className="text-foreground font-semibold">
                €{consultant.rate}/day
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {consultant.skills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 rounded-md text-xs bg-secondary/50 text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
              {consultant.skills.length > 5 && (
                <span className="px-2 py-1 rounded-md text-xs bg-secondary/50 text-muted-foreground">
                  +{consultant.skills.length - 5} more
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {consultant.bio}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
            <Button variant="hero" size="sm">
              Contact
            </Button>
            <Button variant="outline" size="sm">
              View Profile
            </Button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
