import pandas as pd
import random

data = []

for i in range(1000):

    task_complexity = random.randint(1, 5)
    estimated_hours = random.randint(1, 40)
    team_size = random.randint(1, 6)
    priority = random.randint(1, 3)

    # delay rule (simulated logic)
    delay = 0
    if task_complexity > 3 and estimated_hours > 20:
        delay = 1
    if team_size <= 2 and task_complexity >= 4:
        delay = 1

    data.append([
        task_complexity,
        estimated_hours,
        team_size,
        priority,
        delay
    ])

df = pd.DataFrame(
    data,
    columns=[
        "task_complexity",
        "estimated_hours",
        "team_size",
        "priority",
        "delay"
    ]
)

df.to_csv("tasks_dataset.csv", index=False)

print("Dataset generated successfully with 1000 tasks.")