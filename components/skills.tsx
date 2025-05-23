import { Card, CardContent } from "@/components/ui/card"
import { SectionHeading } from "@/components/section-heading"
import { Badge } from "@/components/ui/badge"

const technicalSkills = [
  "Python",
  "Web Scraping",
  "Bot Development",
  "API Integration",
  "Prompt Engineering",
  "Generative AI",
  "MongoDB",
  "Flask",
  "Discord.py",
  "GitHub",
  "Cloud Deployment",
]

const softSkills = [
  "Attention to Detail",
  "Problem Solving",
  "Critical Thinking",
  "Communication",
  "Collaboration",
  "Adaptability",
]

export default function Skills() {
  return (
    <section id="skills" className="py-10">
      <SectionHeading>Skills</SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {technicalSkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Soft Skills</h3>
            <div className="flex flex-wrap gap-2">
              {softSkills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
