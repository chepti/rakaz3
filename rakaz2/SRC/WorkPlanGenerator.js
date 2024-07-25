import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DatePicker } from "@/components/ui/date-picker"

const goals = [
  { id: 1, text: "הטמעת סביבת ענן וכלי סביבת ענן (גוגל קלאסרום/טימס)", emoji: "☁️" },
  { id: 2, text: "קידום חשיבה מחשובית ורובוטיקה בבית הספר", emoji: "🤖" },
  { id: 3, text: "קידום שימוש בתוכנת ניהול פדגוגי (נוכחות, ציונים שוטפים וכו')", emoji: "📊" },
  { id: 4, text: "הטמעה ויישום של נושא אבטחת מידע", emoji: "🔒" },
  { id: 5, text: "הטמעה והגברת שימוש נכון בספקי התוכן שבי\"ס רכש", emoji: "📚" },
  { id: 6, text: "השתתפות בי\"ס (כיתה אחת לפחות) במיזם מחוזי אחד לפחות מתוך רשימת המיזמים המחוזיים", emoji: "🏆" }
];

const objectives = {
  1: [
    "פתיחת כיתה וירטואלית (קלאסרום/טימס) לכל כיתת אם",
    "עבודה בכיתה הוירטואלית באופן שוטף ב-2 כיתות לפחות",
    "הדרכת צוות מורים (מליאה או לפי קבוצות) לשימוש נכון בכיתה וירטואלית",
    "השתתפות במיזם בניית אתרים להטמעת כלי גוגל וסביבת ענן גוגל קלאסרום",
    "השתתפות במיזם של הטמעת סביבת ענן (מיזמים שיפורסמו בהמשך)"
  ],
  // ... (other objectives remain the same)
};

const WorkPlanGenerator = () => {
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [workPlan, setWorkPlan] = useState([]);
  const [step, setStep] = useState(1);

  const handleGoalSelection = (goal) => {
    if (selectedGoals.includes(goal.id)) {
      setSelectedGoals(selectedGoals.filter(id => id !== goal.id));
    } else if (selectedGoals.length < 3) {
      setSelectedGoals([...selectedGoals, goal.id]);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      setWorkPlan(selectedGoals.map(goalId => ({
        goal: goals.find(g => g.id === goalId),
        objectives: [],
        resources: '',
        partners: '',
        performanceIndicators: '',
        startDate: '',
        measurementDate: ''
      })));
      setStep(2);
    }
  };

  const handleObjectiveChange = (goalId, value) => {
    setWorkPlan(workPlan.map(item => 
      item.goal.id === goalId 
        ? { ...item, objectives: value }
        : item
    ));
  };

  const handleInputChange = (goalId, field, value) => {
    setWorkPlan(workPlan.map(item => 
      item.goal.id === goalId ? { ...item, [field]: value } : item
    ));
  };

  const generateHtmlFile = () => {
    const htmlContent = `
      <html>
        <head>
          <title>תכנית עבודה שנתית - רכז טכנו-פדגוגי</title>
          <style>
            body { font-family: Arial, sans-serif; direction: rtl; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 8px; text-align: right; }
          </style>
        </head>
        <body>
          <h1>תכנית עבודה שנתית - רכז טכנו-פדגוגי</h1>
          <table>
            <tr>
              <th>מטרה</th>
              <th>יעדים</th>
              <th>משאבים</th>
              <th>שותפים</th>
              <th>מדדי ביצוע</th>
              <th>תאריך התחלה</th>
              <th>תאריך מדידה</th>
            </tr>
            ${workPlan.map(item => `
              <tr>
                <td>${item.goal.text}</td>
                <td>${item.objectives.map(index => objectives[item.goal.id][index]).join(', ')}</td>
                <td>${item.resources}</td>
                <td>${item.partners}</td>
                <td>${item.performanceIndicators}</td>
                <td>${item.startDate}</td>
                <td>${item.measurementDate}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'work-plan.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">בניית תכנית עבודה שנתית בתקשוב</h1>
      
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">בחרו 3 מטרות מרכזיות שונות מתוך המטרות הבאות שבהן תתמקדו במהלך השנה כרכזי תקשוב</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map(goal => (
              <Button
                key={goal.id}
                onClick={() => handleGoalSelection(goal)}
                variant={selectedGoals.includes(goal.id) ? "default" : "outline"}
                className="justify-start"
                disabled={selectedGoals.length === 3 && !selectedGoals.includes(goal.id)}
              >
                {goal.emoji} {goal.text}
              </Button>
            ))}
          </div>
          <Button
            onClick={handleNextStep}
            className="mt-4"
            disabled={selectedGoals.length !== 3}
          >
            המשך לשלב הבא
          </Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">פירוט תכנית העבודה</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מטרה</TableHead>
                <TableHead>יעדים</TableHead>
                <TableHead>משאבים</TableHead>
                <TableHead>שותפים</TableHead>
                <TableHead>מדדי ביצוע</TableHead>
                <TableHead>תאריך התחלה</TableHead>
                <TableHead>תאריך מדידה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workPlan.map(item => (
                <TableRow key={item.goal.id}>
                  <TableCell>{item.goal.text}</TableCell>
                  <TableCell>
                    <Select
                      onValueChange={(value) => handleObjectiveChange(item.goal.id, value)}
                      value={item.objectives}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחר יעדים" />
                      </SelectTrigger>
                      <SelectContent>
                        {objectives[item.goal.id].map((objective, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {objective}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.resources}
                      onChange={(e) => handleInputChange(item.goal.id, 'resources', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.partners}
                      onChange={(e) => handleInputChange(item.goal.id, 'partners', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.performanceIndicators}
                      onChange={(e) => handleInputChange(item.goal.id, 'performanceIndicators', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <DatePicker
                      selected={item.startDate}
                      onSelect={(date) => handleInputChange(item.goal.id, 'startDate', date)}
                    />
                  </TableCell>
                  <TableCell>
                    <DatePicker
                      selected={item.measurementDate}
                      onSelect={(date) => handleInputChange(item.goal.id, 'measurementDate', date)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            onClick={generateHtmlFile}
            className="mt-4"
          >
            שמור והורד קובץ
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkPlanGenerator;