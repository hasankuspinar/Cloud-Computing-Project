import time
import random
from locust import HttpUser, task, between

class TodoUser(HttpUser):
    wait_time = between(5, 5)  # Every 5 seconds
    created_ids = []

    @task
    def create_and_cleanup(self):
        task_names = [
            "Learn Kubernetes", "Set up GCP", "Deploy Docker containers",
            "Configure load balancing", "Implement Cloud Functions",
            "Test scaling capabilities", "Create monitoring dashboards",
            "Write documentation", "Run performance tests"
        ]

        # Create 2 todos
        for _ in range(2):
            payload = {"title": f"{random.choice(task_names)} {random.randint(1, 10000)}"}
            with self.client.post("/api/todos", json=payload, catch_response=True) as response:
                if response.status_code == 201:
                    todo = response.json()
                    self.created_ids.append(todo["id"])
                    response.success()
                else:
                    response.failure("❌ Failed to create todo")

        # Wait 1 sec, mark 1 random todo as completed
        time.sleep(1)
        if self.created_ids:
            todo_id = random.choice(self.created_ids)
            with self.client.put(f"/api/todos/{todo_id}", json={"completed": True}, catch_response=True) as response:
                if response.status_code == 200:
                    response.success()
                else:
                    response.failure("❌ Failed to complete todo")

        # Wait 1 sec, call cleanup function
        time.sleep(1)
        cleanup_url = "https://us-central1-weighty-sled-459211-h7.cloudfunctions.net/cleanupCompletedTodos"
        with self.client.get(cleanup_url, name="Trigger Cleanup", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure("❌ Cleanup function failed")
