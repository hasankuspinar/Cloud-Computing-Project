# Cloud-Native Todo Application

A fullstack todo application built with a modern, cloud-native architecture. This README provides **step-by-step instructions** for deploying the application on **Google Kubernetes Engine (GKE)**, along with configuration for a **Cloud Function** used for background cleanup and **Locust** performance testing.

---

## 📁 Project Structure

```
├── backend/          # Node.js Express API
├── frontend/         # React.js SPA
├── kubernetes/       # YAML manifests for GKE
├── cloud-function/   # Cloud Function for cleaning completed todos
├── locust/           # Performance tests
├── docker-compose.yml
```

---

## 🔧 Prerequisites

Before you start, make sure the following tools are installed:

* [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
* [Docker](https://www.docker.com/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/)
* [gcloud CLI Authenticated](https://cloud.google.com/sdk/docs/initializing)

Enable required APIs:

```bash
gcloud services enable compute.googleapis.com \
    container.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    cloudfunctions.googleapis.com \
    sqladmin.googleapis.com \
    vpcaccess.googleapis.com
```

---

## 🚀 Step-by-Step GKE Deployment Guide

### 1. **Create GKE Cluster**

```bash
gcloud container clusters create todo-cluster \
  --zone us-central1-c \
  --num-nodes=2
```

### 2. **Build and Push Docker Images to Artifact Registry**

#### Create Artifact Repos

```bash
gcloud artifacts repositories create todo-backend --repository-format=docker --location=us-central1
```

#### Build and Push Backend

```bash
cd ../backend/
docker build -t <DOCKER_HUB_USERNAME>/backend:latest .
docker push <DOCKER_HUB_USERNAME>/backend:latest
```

#### Build and Push Frontend

```bash
cd frontend/
docker build -t <DOCKER_HUB_USERNAME>/frontend:latest .
docker push <DOCKER_HUB_USERNAME>/frontend:latest
```

### 3. **Update Kubernetes YAMLs**

In `kubernetes/deployment.yaml`, update image paths:

```yaml
image: <DOCKER_HUB_USERNAME>/backend:latest
```

Do the same for frontend deployment.

### 4. **Deploy to GKE**

```bash
cd kubernetes
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
```

### 5. **Expose Frontend via Load Balancer**

```bash
kubectl apply -f ingress.yaml
```

Ensure you have an Ingress controller (e.g., NGINX or GKE Ingress) installed.

---

## 🧠 Deploy Cloud Function (Cleanup Completed Todos)


## 🛠️ Cloud SQL Setup (MySQL)

Follow these steps to create a MySQL instance on **Google Cloud SQL** with public access for development or testing purposes.

### 🔧 Step 1: Create Cloud SQL Instance

1. Go to **[Google Cloud SQL Console](https://console.cloud.google.com/sql)**.
2. Click **“Create Instance”**.
3. Choose **“MySQL”** as the database type.

### ⚙️ Step 2: Configure Basic Settings


### 🌐 Step 3: Enable Public IP and Authorized Networks

1. Go to the **Connections** section in the left menu.
2. Under **Public IP**, click **“Add Network”**.
3. Add a network:

   * **Name**: `dev-access`
   * **Network**:

     * Use `0.0.0.0/0` to allow all IPs (*for testing only*), or
     * Use your current IP 
4. Click **Done** and **Save**.

### 👤 Step 4: Add Database and User

1. In the **Databases** tab:

   * Click **“Create Database”**
2. In the **Users** tab:

   * Click **“Add User Account”**

### 📋 Step 5: Get Public IP

* Go to the **Instance Details** page.
* Copy the **Public IP address** .

You will use the environment variables below:
* DB_HOST=<PUBLIC_IP>
* DB_USER=<USER>
* DB_PASSWORD=<PASSWORD>
* DB_NAME=tododb


### 2. **Deploy Cloud Function**

```bash
cd cloud-function
gcloud functions deploy cleanupCompletedTodos \
  --runtime=nodejs18 \
  --trigger-http \
  --region=us-central1 \
  --allow-unauthenticated \
  --entry-point=cleanupCompletedTodos \
  --source=. \
  --set-env-vars="DB_HOST=<PUBLIC_IP>,DB_USER=<USER>,DB_PASSWORD=<PASSWORD>,DB_NAME=tododb"
```

Copy the deployed function URL for use in Locust.

---

## 📈 Load Testing with Locust

### 1. **Install Locust**

```bash
pip install locust
```

### 2. **Run Test**

```bash
cd locust
locust -f locustfile.py --host=http://<BACKEND_LOAD_BALANCER_IP>:5000
```

Visit: [http://localhost:8089](http://localhost:8089) to run tests.

### ✅ Load Test Flow:

* Every 5 seconds:

  * Create 2 todos
  * Mark 1 as completed
  * Call Cloud Function cleanup

---
