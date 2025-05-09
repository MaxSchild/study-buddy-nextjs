import { ProjectStatusCard } from "@/components/ui/expandable-card"

export default function ExamplePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">PrismUI Example Page</h1>
      
      <div className="grid gap-6 max-w-2xl">
        <ProjectStatusCard
          title="Study Session Project"
          progress={75}
          dueDate="in 3 days"
          contributors={[
            { name: "John Doe" },
            { name: "Jane Smith" },
            { name: "Mike Johnson" }
          ]}
          tasks={[
            { title: "Complete Calculus exercises", completed: true },
            { title: "Review Linear Algebra notes", completed: true },
            { title: "Prepare for group discussion", completed: false }
          ]}
          githubStars={42}
          openIssues={3}
        />

        <ProjectStatusCard
          title="Quiz Preparation"
          progress={30}
          dueDate="in 1 week"
          contributors={[
            { name: "Alice Brown" },
            { name: "Bob Wilson" }
          ]}
          tasks={[
            { title: "Create study schedule", completed: true },
            { title: "Review past quizzes", completed: false },
            { title: "Practice problems", completed: false }
          ]}
          githubStars={15}
          openIssues={2}
        />
      </div>
    </div>
  )
} 