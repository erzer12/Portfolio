import { Card, CardContent } from "@/components/ui/card"
import { SectionHeading } from "@/components/section-heading"
import { Award } from "lucide-react"

const certifications = [
  {
    id: 1,
    title: "Python Programming MOOC",
    issuer: "University of Helsinki",
    date: "Mar 2025",
  },
  {
    id: 2,
    title: "CSS (Basic)",
    issuer: "HackerRank",
    date: "Apr 2025",
  },
]

export default function Certifications() {
  return (
    <section id="certifications" className="py-10">
      <SectionHeading>Certifications</SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map((cert) => (
          <Card key={cert.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-primary/10 rounded-full">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{cert.title}</h3>
                  <p className="text-muted-foreground">{cert.issuer}</p>
                  <p className="text-sm text-muted-foreground mt-1">{cert.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
