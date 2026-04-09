# VisionCheck AI — Color Blindness Detection System

A full-stack intelligent web application that detects color vision deficiency (CVD) using Ishihara plates and machine learning.

---

## Project Structure

```
VisionAI/
├── backend/              ← Spring Boot REST API (Java)
├── ml-service/           ← Python Flask ML inference service
├── NoteBook/             ← Jupyter notebook + trained model (.pkl)
├── Ishihara Plates/      ← 30 plate images (4 categories)
├── ishihara_ml_dataset.csv
└── plates_metadata_final.xlsx
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend API | Java 22, Spring Boot 3.3 |
| ML Service | Python 3.12, Flask, Scikit-learn |
| Database | MongoDB Atlas |
| Security | JWT (JJWT 0.12.5), BCrypt |
| ML Model | Random Forest Classifier (500 trees) |

---

## CVD Classification Labels

| Label | Meaning |
|---|---|
| `Normal` | No color vision deficiency |
| `Protanopia` | Red-blind |
| `Deuteranopia` | Green-blind |
| `RG_Deficient` | General red-green deficiency |

---

## Getting Started

### Prerequisites
- Java 22+
- Python 3.12+
- Maven (or use included `./mvnw`)
- MongoDB Atlas account (or local MongoDB)

---

### 1. ML Service Setup

```bash
cd ml-service
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

**Endpoints:**
- `GET  /health` — health check
- `POST /predict` — takes 6 features, returns prediction + confidence

---

### 2. Backend Setup

```bash
cd backend
```

Update `src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=<your-mongodb-atlas-uri>
ml.service.url=http://localhost:5000
jwt.secret=<your-secret-key-min-256-bits>
cors.allowed.origins=http://localhost:3000
```

Run:
```bash
./mvnw spring-boot:run
# Runs on http://localhost:8081
```

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Register new user |
| POST | `/api/auth/login` | None | Login, returns JWT |

### Plates
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/plates` | None | Get all 30 plate metadata |
| GET | `/api/plates/image/{n}` | None | Serve plate image (1–30) |

### Test
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/test/submit` | JWT | Submit responses, get prediction |
| GET | `/api/test/history` | JWT | Get user's test history |

### Admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/analytics` | JWT (ADMIN) | Get distribution + totals |

---

### Test Submit Request Body
```json
{
  "controlFail": 0,
  "redFail": 6,
  "greenFail": 0,
  "vanishingSeen": 1,
  "totalCorrect": 10,
  "totalSeen": 18
}
```

### Test Submit Response
```json
{
  "id": "...",
  "prediction": "Protanopia",
  "confidence": 100.0,
  "scores": {
    "Normal": 0.0,
    "Protanopia": 100.0,
    "Deuteranopia": 0.0,
    "RG_Deficient": 0.0
  },
  "takenAt": "2026-04-10T00:44:40"
}
```

---

## Ishihara Plate Categories

| Category | Plates | Purpose |
|---|---|---|
| Green Dominant | 1–12 | Tests green perception |
| Red Dominant | 13–22 | Tests red perception |
| Control | 23–26 | Everyone should see these |
| Vanishing | 27–30 | Only CVD users see these |

---

## ML Model

- Algorithm: `RandomForestClassifier` (500 estimators)
- Training data: 10,000 synthetic patient records
- Accuracy: 100% on test set
- Features: `control_fail`, `red_fail`, `green_fail`, `vanishing_seen`, `total_correct`, `total_seen`
- Saved at: `NoteBook/cvd_random_forest_model.pkl`

---

## Team

| Name | Exam Seat No. |
|---|---|
| Prasad Ingole | 202301040064 |
| Suyash Dahitule | 202301040053 |
| Ketan Sonawane | 202301040161 |
| Om Ranmode | 202301040026 |

Guide: Dr. Chetna Nemade
MIT Academy of Engineering, Pune — B.Tech Computer Engineering (2025–2026)
