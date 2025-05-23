import { Card, CardContent } from "@/components/ui/card"
import { SectionHeading } from "@/components/section-heading"
import { GraduationCap } from "lucide-react"

export default function Education() {
  return (
    <section id="education" className="py-10">
      <SectionHeading>Education</SectionHeading>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 p-2 bg-primary/10 rounded-full">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">B.Tech in Computer Science (AI & ML)</h3>
              <p className="text-muted-foreground">College of Engineering, Kottarakkara</p>
              <p className="text-sm text-muted-foreground mt-1">2023 – 2027</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
