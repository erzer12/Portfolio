import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

export function SkillsManager() {
  const [skillCategories, setSkillCategories] = useState([
    {
      id: 1,
      category: 'Programming Languages',
      skills: ['Python', 'JavaScript', 'Java', 'C++', 'TypeScript']
    },
    {
      id: 2,
      category: 'AI & Machine Learning',
      skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenCV', 'Pandas']
    },
    {
      id: 3,
      category: 'Web Development',
      skills: ['React', 'Node.js', 'Express', 'Next.js', 'Tailwind CSS']
    },
    {
      id: 4,
      category: 'Tools & Technologies',
      skills: ['Git', 'Docker', 'AWS', 'MongoDB', 'PostgreSQL']
    }
  ]);

  const [newCategory, setNewCategory] = useState('');
  const [newSkill, setNewSkill] = useState({ categoryId: 0, skill: '' });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(0);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const category = {
        id: Date.now(),
        category: newCategory,
        skills: []
      };
      setSkillCategories([...skillCategories, category]);
      setNewCategory('');
      setShowAddCategory(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.skill.trim() && newSkill.categoryId) {
      setSkillCategories(prev =>
        prev.map(cat =>
          cat.id === newSkill.categoryId
            ? { ...cat, skills: [...cat.skills, newSkill.skill] }
            : cat
        )
      );
      setNewSkill({ categoryId: 0, skill: '' });
      setShowAddSkill(0);
    }
  };

  const handleRemoveSkill = (categoryId: number, skillIndex: number) => {
    setSkillCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, skills: cat.skills.filter((_, index) => index !== skillIndex) }
          : cat
      )
    );
  };

  const handleDeleteCategory = (categoryId: number) => {
    setSkillCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Skills</h1>
          <p className="text-gray-600">Manage your technical skills and expertise</p>
        </div>
        <Button
          onClick={() => setShowAddCategory(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          + Add Category
        </Button>
      </div>

      {showAddCategory && (
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                className="flex-1"
              />
              <Button onClick={handleAddCategory} className="bg-blue-600 hover:bg-blue-700 text-white">
                Add
              </Button>
              <Button variant="outline" onClick={() => setShowAddCategory(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {skillCategories.map((category) => (
          <Card key={category.id} className="border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.category}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddSkill(category.id)}
                    className="text-sm"
                  >
                    + Add Skill
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Delete Category
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showAddSkill === category.id && (
                <div className="flex gap-3 mb-4">
                  <Input
                    value={newSkill.skill}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, skill: e.target.value, categoryId: category.id }))}
                    placeholder="Enter skill name"
                    className="flex-1"
                  />
                  <Button onClick={handleAddSkill} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Add
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowAddSkill(0)}>
                    Cancel
                  </Button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 px-3 py-1 cursor-pointer hover:bg-blue-100 group"
                    onClick={() => handleRemoveSkill(category.id, index)}
                  >
                    {skill}
                    <span className="ml-2 opacity-0 group-hover:opacity-100 text-red-500">×</span>
                  </Badge>
                ))}
                {category.skills.length === 0 && (
                  <p className="text-gray-500 text-sm">No skills added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}