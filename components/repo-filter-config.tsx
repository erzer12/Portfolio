"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getExcludedRepos, getFilteringOptions } from "@/lib/github"

export default function RepoFilterConfig() {
  const [excludedRepos, setExcludedRepos] = useState<string[]>(getExcludedRepos())
  const [newRepo, setNewRepo] = useState("")
  const filteringOptions = getFilteringOptions()

  const addRepo = () => {
    if (newRepo.trim() && !excludedRepos.includes(newRepo.trim().toLowerCase())) {
      setExcludedRepos([...excludedRepos, newRepo.trim().toLowerCase()])
      setNewRepo("")
    }
  }

  const removeRepo = (repoToRemove: string) => {
    setExcludedRepos(excludedRepos.filter((repo) => repo !== repoToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addRepo()
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Filter Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Repository Filter Configuration</DialogTitle>
          <DialogDescription>Manage which repositories are excluded from your portfolio display.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add new exclusion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Repository to Exclude</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter repository name..."
                  value={newRepo}
                  onChange={(e) => setNewRepo(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button onClick={addRepo} disabled={!newRepo.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Repository names are case-insensitive and support partial matching.
              </p>
            </CardContent>
          </Card>

          {/* Current exclusions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Currently Excluded Repositories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {excludedRepos.map((repo) => (
                  <Badge key={repo} variant="secondary" className="gap-1">
                    {repo}
                    <button
                      onClick={() => removeRepo(repo)}
                      className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {excludedRepos.length === 0 && (
                <p className="text-muted-foreground text-sm">No repositories are currently excluded.</p>
              )}
            </CardContent>
          </Card>

          {/* Current filter settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Filter Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Minimum Size:</span> {filteringOptions.minSize}KB
                </div>
                <div>
                  <span className="font-medium">Minimum Stars:</span> {filteringOptions.minStars}
                </div>
                <div>
                  <span className="font-medium">Require Description:</span>{" "}
                  {filteringOptions.requireDescription ? "Yes" : "No"}
                </div>
                <div>
                  <span className="font-medium">Exclude Archived:</span>{" "}
                  {filteringOptions.excludeArchived ? "Yes" : "No"}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                To modify these settings, edit the FILTERING_OPTIONS in lib/github.ts
              </p>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How to Add Specific Repositories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p>
                  <strong>Method 1:</strong> Use the form above to add repositories interactively.
                </p>
                <p>
                  <strong>Method 2:</strong> Edit the EXCLUDED_REPOS array in{" "}
                  <code className="bg-muted px-1 rounded">lib/github.ts</code>
                </p>
                <p>
                  <strong>Examples of repositories you might want to exclude:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                  <li>Practice or learning repositories</li>
                  <li>Incomplete or broken projects</li>
                  <li>College assignments</li>
                  <li>Personal scripts or utilities</li>
                  <li>Forked repositories (automatically excluded)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
